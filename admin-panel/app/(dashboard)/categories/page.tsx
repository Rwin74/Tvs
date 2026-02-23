"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const categorySchema = z.object({
    name: z.string().min(2, "Kategori adı en az 2 karakter olmalı"),
    slug: z.string(),
    description: z.string().optional()
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "", slug: "", description: "" }
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
            fetchCategories()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Kategoriyi silmek istediğinize emin misiniz?")) return

        // Not yet implemented API route for DELETE. Left for future enhancement
        // await fetch(`/admin/api/categories/${id}`, { method: 'DELETE' })
        alert("Silme işlemi şu an aktif değil")
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
                                            if (!form.getValues("slug")) {
                                                const slug = e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
                                                form.setValue("slug", slug)
                                            }
                                        }
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Bağlantı URL (Slug)</Label>
                                <Input id="slug" placeholder="banyo-tekstili" {...form.register("slug")} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Textarea id="description" placeholder="Açıklama (opsiyonel)" {...form.register("description")} />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
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
                            <div className="space-y-4">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{cat.name}</p>
                                            <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="text-destructive">
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
