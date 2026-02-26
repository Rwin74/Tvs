"use client"

import { useState, useEffect, useRef } from "react"
import { Image as ImageIcon, Upload, Save, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { addToast } from "@/components/Toaster"

type SlideItem = {
    id: string
    name: string
    image: string
    slug: string
}

export default function SliderPage() {
    const [slides, setSlides] = useState<SlideItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null) // categoryId being saved
    const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

    const fetchSlides = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/categories")
            const data = await res.json()
            if (Array.isArray(data)) {
                setSlides(data.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    image: c.imageUrl || "",
                    slug: c.slug,
                })))
            }
        } catch {
            addToast("Slider verileri yüklenemedi", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSlides() }, [])

    const handleImageUpload = async (id: string, file: File) => {
        const fd = new FormData()
        fd.append("file", file)
        setSaving(id)
        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd })
            const data = await res.json()
            const url = data.url || data.path
            if (!url) throw new Error("URL alınamadı")
            // Update category in DB
            await saveSlide(id, undefined, url)
        } catch (e: any) {
            addToast("Görsel yüklenemedi: " + e.message, "error")
            setSaving(null)
        }
    }

    const saveSlide = async (id: string, name?: string, imageUrl?: string) => {
        setSaving(id)
        try {
            const slide = slides.find(s => s.id === id)
            if (!slide) return

            const payload: any = {
                name: name ?? slide.name,
                slug: slide.slug,
                imageUrl: imageUrl ?? slide.image,
            }

            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Güncelleme başarısız")
            }

            // Update local state
            setSlides(prev => prev.map(s => s.id === id
                ? { ...s, name: payload.name, image: payload.imageUrl }
                : s
            ))

            // Auto-publish
            await fetch("/api/publish", { method: "POST" }).catch(() => { })

            addToast("Slide güncellendi ve site yenilendi ✓", "success")
        } catch (e: any) {
            addToast("Hata: " + e.message, "error")
        } finally {
            setSaving(null)
        }
    }

    if (loading) return <div className="p-8 text-muted-foreground">Yükleniyor...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Slider Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">Ana sayfadaki tam ekran slider'ı yönet</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchSlides}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                </Button>
            </div>

            {slides.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Henüz kategori yok. Kategoriler ekledikçe burada görünür.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {slides.map(slide => (
                        <Card key={slide.id} className="overflow-hidden">
                            {/* Slide Preview */}
                            <div className="relative h-48 bg-gray-900 group cursor-pointer"
                                onClick={() => fileRefs.current[slide.id]?.click()}>
                                {slide.image ? (
                                    <img
                                        src={slide.image}
                                        alt={slide.name}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-600" />
                                    </div>
                                )}
                                {/* Overlay text (like real slide) */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-white font-bold text-xl tracking-widest uppercase drop-shadow">
                                        {slide.name}
                                    </p>
                                    <p className="text-white/70 text-xs mt-1">Premium Ev Tekstili</p>
                                </div>
                                {/* Upload hint */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs text-center py-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <Upload className="h-3 w-3" />
                                    Yeni Görsel Yükle
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={el => { fileRefs.current[slide.id] = el }}
                                    onChange={e => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageUpload(slide.id, file)
                                    }}
                                />
                            </div>

                            <CardContent className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground font-medium">Slide Adı</label>
                                    <Input
                                        value={slide.name}
                                        onChange={e => setSlides(prev => prev.map(s =>
                                            s.id === slide.id ? { ...s, name: e.target.value } : s
                                        ))}
                                        placeholder="Kategori adı..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground font-medium">Görsel URL</label>
                                    <Input
                                        value={slide.image}
                                        onChange={e => setSlides(prev => prev.map(s =>
                                            s.id === slide.id ? { ...s, image: e.target.value } : s
                                        ))}
                                        placeholder="/img/uploads/gorsel.jpg"
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    size="sm"
                                    onClick={() => saveSlide(slide.id)}
                                    disabled={saving === slide.id}
                                >
                                    {saving === slide.id ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Kaydediliyor...</>
                                    ) : (
                                        <><Save className="h-4 w-4 mr-2" />Kaydet</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
