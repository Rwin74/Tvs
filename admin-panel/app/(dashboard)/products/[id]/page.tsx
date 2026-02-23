"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, Plus, Trash2, Image as ImageIcon, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Schema - Same as Create
const productSchema = z.object({
    name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır"),
    slug: z.string(),
    shortDescription: z.string().optional(),
    gsm: z.union([z.number(), z.string(), z.undefined()]).optional().transform(v => (v === "" || v === undefined) ? undefined : Number(v)),
    fabricType: z.string().optional(),
    basePrice: z.union([z.number(), z.string()]).transform(val => Number(val)),
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

import { use } from "react" // Import use from react

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [variants, setVariants] = useState<{ size: string; color: string; stock: number }[]>([])
    const [images, setImages] = useState<string[]>([]) // Existing images
    const [newImages, setNewImages] = useState<string[]>([]) // Newly uploaded in this session

    const router = useRouter()
    // Resolving params correctly with React.use()
    const { id } = use(params)

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            slug: "",
            basePrice: 0,
        },
    })

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/admin/api/products/${id}`)
                if (!res.ok) throw new Error("Ürün bulunamadı")
                const product = await res.json()

                // Populate Form
                form.reset({
                    name: product.name,
                    slug: product.slug,
                    shortDescription: product.shortDescription || "",
                    gsm: product.gsm ? Number(product.gsm) : undefined,
                    fabricType: product.fabricType || "",
                    basePrice: Number(product.basePrice) || 0,
                    metaTitle: product.seo?.metaTitle || "",
                    metaDescription: product.seo?.metaDescription || "",
                })

                // Populate Variants
                if (product.variants) {
                    setVariants(product.variants.map((v: any) => ({
                        size: v.size,
                        color: v.colorCode,
                        stock: v.stockQuantity
                    })))
                }

                // Populate Media
                if (product.media) {
                    setImages(product.media.map((m: any) => m.filePath))
                }

            } catch (error) {
                console.error(error)
                alert("Ürün bilgileri yüklenemedi")
            } finally {
                setFetching(false)
            }
        }

        if (id) fetchProduct()
    }, [id, form])

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const payload = {
                ...data,
                basePrice: Number(data.basePrice),
                gsm: data.gsm ? Number(data.gsm) : undefined,
                variants: variants,
                images: images,
                newImages: newImages
            }

            console.log("PAYLOAD_TO_SEND:", JSON.stringify(payload, null, 2))

            const response = await fetch(`/admin/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Güncelleme başarısız")
            }

            alert("Ürün başarıyla güncellendi!")
            router.push("/products")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert("Hata: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const addVariant = () => {
        setVariants([...variants, { size: "M", color: "Beyaz", stock: 10 }])
    }

    const onError = (errors: any) => {
        alert("Lütfen tüm alanları (özellikle gizli sekmelerdeki zorunlu alanları) kontrol edin. Eksik alanlar: " + Object.keys(errors).join(", "))
    }

    if (fetching) return <div className="p-8">Yükleniyor...</div>

    return (
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" type="button" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Ürünü Düzenle</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>İptal</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Güncelle
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
                    <TabsTrigger value="general">Genel</TabsTrigger>
                    <TabsTrigger value="variants">Varyant</TabsTrigger>
                    <TabsTrigger value="pricing">Fiyat</TabsTrigger>
                    <TabsTrigger value="media">Medya</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <div>
                    {/* GENERAL TAB */}
                    <TabsContent value="general" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Ürün Adı</Label>
                                    <Input id="name" {...form.register("name")} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slug">URL (Slug)</Label>
                                    <Input id="slug" {...form.register("slug")} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="shortDescription">Kısa Açıklama</Label>
                                    <Textarea id="shortDescription" {...form.register("shortDescription")} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="gsm">GSM</Label>
                                        <Input id="gsm" type="number" {...form.register("gsm", { valueAsNumber: true })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="fabricType">İplik Türü</Label>
                                        <select
                                            id="fabricType"
                                            {...form.register("fabricType")}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="Cotton">Pamuk</option>
                                            <option value="Bamboo">Bambu</option>
                                            <option value="Microfiber">Mikrofiber</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* VARIANTS TAB */}
                    <TabsContent value="variants" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Varyantlar</CardTitle>
                                <CardDescription>Mevcut varyantlar silinip tekrar oluşturulur.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" onClick={addVariant} size="sm" variant="secondary">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Varyant Ekle
                                    </Button>
                                </div>
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-muted/50">
                                        <div>Beden</div>
                                        <div>Renk</div>
                                        <div>Stok</div>
                                        <div>İşlem</div>
                                    </div>
                                    {variants.map((v, i) => (
                                        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-t items-center">
                                            <Input
                                                value={v.size}
                                                onChange={(e) => {
                                                    const newV = [...variants]; newV[i].size = e.target.value; setVariants(newV)
                                                }}
                                                className="h-8"
                                            />
                                            <Input
                                                value={v.color}
                                                onChange={(e) => {
                                                    const newV = [...variants]; newV[i].color = e.target.value; setVariants(newV)
                                                }}
                                                className="h-8"
                                            />
                                            <Input
                                                type="number"
                                                value={v.stock}
                                                onChange={(e) => {
                                                    const newV = [...variants]; newV[i].stock = Number(e.target.value); setVariants(newV)
                                                }}
                                                className="h-8"
                                            />
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                                                onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PRICING TAB */}
                    <TabsContent value="pricing" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fiyat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <Label htmlFor="basePrice">Fiyat (TL)</Label>
                                    <Input id="basePrice" type="number" {...form.register("basePrice", { valueAsNumber: true })} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MEDIA TAB */}
                    <TabsContent value="media" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Görseller</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={async (e) => {
                                                if (!e.target.files?.length) return

                                                try {
                                                    const file = e.target.files[0]
                                                    const fd = new FormData()
                                                    fd.append("file", file)

                                                    const res = await fetch("/admin/api/upload", { method: "POST", body: fd })
                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        setNewImages(prev => [...prev, data.url])
                                                    }
                                                } catch (err) {
                                                    alert("Yükleme hatası")
                                                }
                                            }}
                                        />
                                    </div>

                                    <Label>Mevcut Görseller</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {images.map((url, i) => (
                                            <div key={i} className="group relative aspect-square border rounded-md overflow-hidden bg-muted">
                                                <img src={url} alt="Product" className="object-cover w-full h-full" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Label className="mt-4 block">Yeni Eklenen Görseller</Label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {newImages.map((url, i) => (
                                            <div key={i} className="group relative aspect-square border rounded-md overflow-hidden bg-muted">
                                                <img src={url} alt="Product" className="object-cover w-full h-full" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                    onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* SEO TAB */}
                    <TabsContent value="seo" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="metaTitle">Meta Başlık</Label>
                                    <Input id="metaTitle" {...form.register("metaTitle")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="metaDescription">Meta Açıklama</Label>
                                    <Textarea id="metaDescription" {...form.register("metaDescription")} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </form>
    )
}
