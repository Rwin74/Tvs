"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Schema Validation
const productSchema = z.object({
    name: z.string().min(2, "Ürün adı en az 2 karakter olmalıdır"),
    slug: z.string(),
    shortDescription: z.string().optional(),
    gsm: z.preprocess(
        (val) => {
            if (val === null || val === undefined || val === '' || val === false) return undefined;
            const n = Number(val);
            return isNaN(n) ? undefined : n;
        },
        z.number().optional()
    ),
    fabricType: z.string().optional(),
    basePrice: z.coerce.number().min(0),
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    categoryId: z.string().min(2, "Lütfen bir kategori seçin"),
})

type ProductFormValues = z.infer<typeof productSchema>

export default function AddProductPage() {
    const [loading, setLoading] = useState(false)
    const [variants, setVariants] = useState<{ size: string; color: string; stock: number; price: string }[]>([])
    const [images, setImages] = useState<string[]>([])
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

    useEffect(() => {
        // Fetch categories dynamically
        fetch("/admin/api/categories")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data)
            })
            .catch(err => console.error("Kategoriler yüklenemedi", err))
    }, [])

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            slug: "",
            basePrice: 0,
            categoryId: "",
        },
    })

    const router = useRouter()

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const payload = {
                ...data,
                basePrice: Number(data.basePrice),
                gsm: data.gsm ? Number(data.gsm) : undefined,
                variants: variants,
                images: images
            }

            const response = await fetch("/admin/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Bir hata oluştu")
            }

            alert("Ürün başarıyla oluşturuldu!")

            // Auto-publish to site
            try {
                await fetch("/admin/api/publish", { method: "POST" })
            } catch (_) { /* publish hataları sessiz geçsin */ }

            router.push("/products")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert("Hata: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const onError = (errors: any) => {
        alert("Lütfen tüm alanları (özellikle gizli sekmelerdeki zorunlu alanları) kontrol edin. Eksik alanlar: " + Object.keys(errors).join(", "))
    }

    const addVariant = () => {
        setVariants([...variants, { size: "M", color: "Beyaz", stock: 10, price: "" }])
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Yeni Ürün Ekle</h1>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={() => router.push('/products')}>İptal</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Kaydet
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
                                <CardDescription>Ürünün ana özelliklerini giriniz.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Ürün Adı</Label>
                                    <Input
                                        id="name"
                                        placeholder="Örn: Bambu Banyo Havlusu"
                                        {...form.register("name", {
                                            onChange: (e) => {
                                                if (!form.getValues("slug")) {
                                                    const slug = e.target.value
                                                        .toLowerCase()
                                                        .replace(/ /g, "-")
                                                        .replace(/[^\w-]+/g, "")
                                                    form.setValue("slug", slug, { shouldValidate: true })
                                                }
                                            }
                                        })}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slug">URL Uzantısı (Slug)</Label>
                                    <Input id="slug" {...form.register("slug")} placeholder="bambu-banyo-havlusu" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="shortDescription">Kısa Açıklama</Label>
                                    <Textarea id="shortDescription" {...form.register("shortDescription")} placeholder="Liste görünümleri için kısa özet..." />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="categoryId">Kategori</Label>
                                    <select
                                        id="categoryId"
                                        {...form.register("categoryId")}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="">Kategori Seçin</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {form.formState.errors.categoryId && (
                                        <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="gsm">GSM (Gramaj)</Label>
                                        <Input id="gsm" type="number" {...form.register("gsm")} placeholder="500" />
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
                                <CardTitle>Varyant ve Stok</CardTitle>
                                <CardDescription>Renk ve beden seçeneklerini yönetin.</CardDescription>
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
                                        <div>Fiyat Farkı (TL)</div>
                                        <div>İşlem</div>
                                    </div>
                                    {variants.map((v, i) => (
                                        <div key={i} className="grid grid-cols-5 gap-4 p-4 border-t items-center">
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
                                                    const newV = [...variants]; newV[i].stock = parseInt(e.target.value); setVariants(newV)
                                                }}
                                                className="h-8"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="+0 TL"
                                                value={v.price}
                                                onChange={(e) => {
                                                    const newV = [...variants]; newV[i].price = e.target.value; setVariants(newV)
                                                }}
                                                className="h-8"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {variants.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground text-sm">
                                            Henüz varyant eklenmedi.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PRICING TAB */}
                    <TabsContent value="pricing" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fiyatlandırma</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="basePrice">Perakende Satış Fiyatı (TL)</Label>
                                        <Input id="basePrice" type="number" {...form.register("basePrice")} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Vergi Oranı (%)</Label>
                                        <Input defaultValue="10" disabled />
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                                    <h4 className="font-semibold mb-2 text-sm">B2B Toptan Fiyatlar</h4>
                                    <p className="text-xs text-muted-foreground mb-4">Bu fiyatları sadece yetkili bayiler görebilir.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Bayi A Grubu</Label>
                                            <Input placeholder="0.00" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Bayi B Grubu</Label>
                                            <Input placeholder="0.00" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MEDIA TAB */}
                    <TabsContent value="media" forceMount className="data-[state=inactive]:hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>Görseller</CardTitle>
                                <CardDescription>Ürün görsellerini yükleyin ve düzenleyin.</CardDescription>
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

                                                const formData = new FormData()
                                                Array.from(e.target.files).forEach((file) => {
                                                    formData.append("file", file)
                                                })

                                                try {
                                                    // Upload first file for demo (loop for multiple if needed)
                                                    // Simple implementation: 1 by 1 or adapt API for multiple
                                                    const file = e.target.files[0]
                                                    const fd = new FormData()
                                                    fd.append("file", file)

                                                    const res = await fetch("/admin/api/upload", {
                                                        method: "POST",
                                                        body: fd
                                                    })

                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        // Add to a state (we need to create this state)
                                                        setImages(prev => [...prev, data.url])
                                                    } else {
                                                        alert("Yükleme başarısız")
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                    alert("Hata oluştu")
                                                }
                                            }}
                                        />
                                    </div>

                                    {images.length > 0 && (
                                        <p className="text-xs text-muted-foreground mt-2">⭐ Yıldıza tıklayarak ana fotoğrafı seçin (ilk sırada gösterilecek)</p>
                                    )}
                                    <div className="grid grid-cols-4 gap-4 mt-2">
                                        {images.map((url, i) => (
                                            <div key={i} className={`relative aspect-square border-2 rounded-md overflow-hidden group ${i === mainImageIndex ? 'border-yellow-400' : 'border-border'}`}>
                                                <img src={url} alt="Uploaded" className="object-cover w-full h-full" />
                                                {i === mainImageIndex && (
                                                    <div className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1 rounded">ANA</div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        className="h-7 w-7 bg-yellow-400 hover:bg-yellow-300 text-yellow-900"
                                                        onClick={() => {
                                                            setMainImageIndex(i)
                                                            // Move main image to front
                                                            setImages(prev => {
                                                                const newArr = [...prev]
                                                                const [main] = newArr.splice(i, 1)
                                                                return [main, ...newArr]
                                                            })
                                                            setMainImageIndex(0)
                                                        }}
                                                        title="Ana fotoğraf yap"
                                                    >
                                                        ⭐
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => {
                                                            setImages(prev => prev.filter((_, idx) => idx !== i))
                                                            if (mainImageIndex >= i) setMainImageIndex(Math.max(0, mainImageIndex - 1))
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
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
                                <CardTitle>Arama Motoru Optimizasyonu (SEO)</CardTitle>
                                <CardDescription>Google'da nasıl görüneceğini özelleştirin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="metaTitle">Meta Başlık (Title)</Label>
                                        <span className="text-xs text-muted-foreground">0/60</span>
                                    </div>
                                    <Input id="metaTitle" {...form.register("metaTitle")} placeholder="Ürün Adı | TVS Tekstil" />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="metaDescription">Meta Açıklama (Description)</Label>
                                        <span className="text-xs text-muted-foreground">0/160</span>
                                    </div>
                                    <Textarea id="metaDescription" {...form.register("metaDescription")} placeholder="Bu ürün..." />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Schema.org (JSON-LD)</Label>
                                    <Textarea className="font-mono text-xs" rows={5} placeholder='{"@context": "https://schema.org", "@type": "Product", ...}' />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </form>
    )
}
