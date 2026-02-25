"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, ArrowLeft, Mail, Phone, Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const quoteUpdateSchema = z.object({
    status: z.enum(["Pending", "OfferSent", "Completed", "Rejected"]),
    notes: z.string().optional(),
})

type QuoteFormValues = z.infer<typeof quoteUpdateSchema>

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [quoteInfo, setQuoteInfo] = useState<any>(null)
    const router = useRouter()

    const form = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteUpdateSchema),
        defaultValues: {
            status: "Pending",
            notes: ""
        },
    })

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch(`/admin/api/quotes/${id}`)
                if (!res.ok) throw new Error("Teklif bulunamadı")
                const quote = await res.json()

                setQuoteInfo(quote)

                form.reset({
                    status: quote.status || "Pending",
                    notes: quote.notes || ""
                })
            } catch (error) {
                console.error(error)
                alert("Teklif yüklenirken hata oluştu.")
            } finally {
                setFetching(false)
            }
        }
        if (id) fetchQuote()
    }, [id, form])

    const onSubmit = async (data: QuoteFormValues) => {
        setLoading(true)
        try {
            const response = await fetch(`/admin/api/quotes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Bir hata oluştu")
            }

            alert("Teklif başarıyla güncellendi!")
            router.push("/admin/quotes")
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
                            <h1 className="text-3xl font-bold tracking-tight">Teklif Talebini Yönet</h1>
                            <p className="text-muted-foreground">Müşteri detayları, notlar ve durum takibi.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push("/quotes")}>İptal</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Kaydet
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Müşteri & İletişim Bilgileri</CardTitle>
                            <CardDescription>Müşterinin formdan gönderdiği temel veriler.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {quoteInfo && (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <div className="font-semibold text-muted-foreground">Müşteri Adı</div>
                                        <div className="col-span-2">{quoteInfo.customerName}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <div className="font-semibold text-muted-foreground">E-posta</div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <Mail className="h-4 w-4" /> {quoteInfo.email}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <div className="font-semibold text-muted-foreground">Telefon</div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <Phone className="h-4 w-4" /> {quoteInfo.phone || "-"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <div className="font-semibold text-muted-foreground">Firma</div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <Building className="h-4 w-4" /> {quoteInfo.companyName || "-"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-2 border-b">
                                        <div className="font-semibold text-muted-foreground">Tarih</div>
                                        <div className="col-span-2">{new Date(quoteInfo.createdAt).toLocaleString("tr-TR")}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Durum & Notlar</CardTitle>
                                <CardDescription>Süreci yönetmek ve dahili not tutmak için kullanılır.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Teklif Durumu</Label>
                                    <Select
                                        onValueChange={(value) => form.setValue("status", value as any)}
                                        value={form.watch("status")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Bekliyor (Pending)</SelectItem>
                                            <SelectItem value="OfferSent">Teklif İletildi</SelectItem>
                                            <SelectItem value="Completed">Tamamlandı</SelectItem>
                                            <SelectItem value="Rejected">İptal / Reddedildi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Yönetici Notları</Label>
                                    <Textarea
                                        id="notes"
                                        className="min-h-[150px]"
                                        {...form.register("notes")}
                                        placeholder="Görüşme detayları veya ekstra notları buraya yazabilirsiniz..."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}
