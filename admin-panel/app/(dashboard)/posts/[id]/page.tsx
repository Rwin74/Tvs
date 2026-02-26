"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const postSchema = z.object({
    title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
    slug: z.string().min(2, "Slug zorunludur"),
    content: z.string().optional(),
    status: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const router = useRouter()

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            status: "Draft",
            metaTitle: "",
            metaDescription: ""
        },
    })

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/posts/${id}`)
                if (!res.ok) throw new Error("Yazı bulunamadı")
                const post = await res.json()

                form.reset({
                    title: post.title,
                    slug: post.slug,
                    content: post.content || "",
                    status: post.status,
                    metaTitle: post.seo?.metaTitle || "",
                    metaDescription: post.seo?.metaDescription || ""
                })
            } catch (error) {
                console.error(error)
                alert("Yazı yüklenirken hata oluştu.")
            } finally {
                setFetching(false)
            }
        }
        if (id) fetchPost()
    }, [id, form])

    const onSubmit = async (data: PostFormValues) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Bir hata oluştu")
            }

            alert("Yazı başarıyla güncellendi!")
            router.push("/posts")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert("Hata: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const onError = (errors: any) => {
        alert("Lütfen formu eksiksiz doldurun. Eksik veya hatalı alanlar: " + Object.keys(errors).join(", "))
    }

    if (fetching) return <div className="p-8">Yükleniyor...</div>

    return (
        <div className="space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" type="button" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Yazıyı Düzenle</h1>
                            <p className="text-muted-foreground">Blog yayınını güncelleyin.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push("/posts")}>İptal</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Güncelle
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>İçerik</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Başlık</Label>
                                    <Input id="title" {...form.register("title")} placeholder="Yazı başlığı..." />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slug">URL (Slug)</Label>
                                    <Input id="slug" {...form.register("slug")} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content">İçerik (HTML veya Markdown)</Label>
                                    <Textarea
                                        id="content"
                                        className="min-h-[300px] font-mono"
                                        {...form.register("content")}
                                        placeholder="Yazı içeriği..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Ayarları</CardTitle>
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
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Yayın Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Durum</Label>
                                    <Select
                                        onValueChange={(value) => form.setValue("status", value)}
                                        value={form.watch("status")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Taslak</SelectItem>
                                            <SelectItem value="Published">Yayında</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
