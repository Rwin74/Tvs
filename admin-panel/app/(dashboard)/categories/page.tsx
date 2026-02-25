"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2, Loader2, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const categorySchema = z.object({
    name: z.string().min(2, "Kategori adı en az 2 karakter olmalı"),
    slug: z.string().min(2, "Slug gerekli"),
    description: z.string().optional(),
    imageUrl: z.string().optional()
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [imagePreview, setImagePreview] = useState("")

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "", slug: "", description: "", imageUrl: "" }
    })

    const fetchCategories = async () => {
        setIsFetching(true)
        try {
            const res = await fetch("/admin/api/categories")
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/admin/api/upload", { method: "POST", body: formData })
            if (!res.ok) throw new Error("Yükleme başarısız")
            const data = await res.json()
            const url = data.url || data.path || data.filePath
            form.setValue("imageUrl", url)
            setImagePreview(url)
        } catch (error: any) {
            alert("Görsel yüklenemedi: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (data: CategoryFormValues) => {
        setLoading(true)
        try {
            const res = await fetch("/admin/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (!res.ok) throw new Error("Kategori oluşturulamadı")

            alert("Kategori başarıyla eklendi!")
            form.reset()
            setImagePreview("")
            fetchCategories()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Kategoriyi silmek istediğinize emin misiniz?")) return

        try {
            const res = await fetch(`/admin/api/categories/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Silme başarısız")
            fetchCategories()
        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Yeni Kategori Ekle</CardTitle>
                        <CardDescription>Sisteme yeni bir ürün kategorisi ekleyin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Kategori Adı</Label>
                                <Input
                                    id="name"
                                    placeholder="Örn: Banyo Tekstili"
                                    {...form.register("name", {
                                        onChange: (e) => {
                                            const slug = e.target.value
                                                .toLowerCase()
                                                .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
                                                .replace(/ö/g, "o").replace(/ı/g, "i").replace(/ç/g, "c")
                                                .replace(/ /g, "-")
                                                .replace(/[^\w-]+/g, "")
                                            form.setValue("slug", slug)
                                        }
                                    })}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Bağlantı URL (Slug)</Label>
                                <Input id="slug" placeholder="banyo-tekstili" {...form.register("slug")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea id="description" placeholder="Açıklama (opsiyonel)" {...form.register("description")} />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Kategori Görseli</Label>
                                <div className="flex flex-col gap-2">
                                    {imagePreview && (
                                        <div className="h-32 w-full rounded-md overflow-hidden border">
                                            <img src={imagePreview} alt="Önizleme" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <label htmlFor="cat-image-upload" className="flex-1">
                                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">
                                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                                                {uploading ? "Yükleniyor..." : "Görsel seç / yükle"}
                                            </div>
                                            <input
                                                id="cat-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                    </div>
                                    <Input
                                        placeholder="veya URL yapıştırın (https://example.com/img.jpg)"
                                        {...form.register("imageUrl")}
                                        onChange={(e) => {
                                            form.setValue("imageUrl", e.target.value)
                                            setImagePreview(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={loading || uploading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Ekle
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mevcut Kategoriler</CardTitle>
                        <CardDescription>Sistemde kayıtlı olan kategorileriniz.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isFetching ? (
                            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                        ) : categories.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Henüz kategori eklenmedi.</p>
                        ) : (
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg gap-3">
                                        {cat.imageUrl ? (
                                            <img src={cat.imageUrl} alt={cat.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{cat.name}</p>
                                            <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="text-destructive flex-shrink-0">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
