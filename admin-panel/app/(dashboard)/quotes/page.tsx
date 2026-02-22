import Link from "next/link"
import { MoreHorizontal, FileText, Mail, Phone, Building, Pencil, Trash2 } from "lucide-react"
import db from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
    const quotes = await db.quoteRequest.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teklif Talepleri (B2B)</h1>
                    <p className="text-muted-foreground">Müşterilerden gelen toptan satış tekliflerini yönetin.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bekleyen Talepler</CardTitle>
                    <CardDescription>
                        Toplam {quotes.length} teklif talebi bulunmaktadır.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Müşteri / Şirket</TableHead>
                                <TableHead>İletişim</TableHead>
                                <TableHead>Talep Notu</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Tarih</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotes.map((quote) => (
                                <TableRow key={quote.id}>
                                    <TableCell>
                                        <div className="font-medium">{quote.customerName}</div>
                                        {quote.companyName && (
                                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                <Building className="mr-1 h-3 w-3" />
                                                {quote.companyName}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm">
                                                <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                                                {quote.email}
                                            </div>
                                            {quote.phone && (
                                                <div className="flex items-center text-sm">
                                                    <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                                                    {quote.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="truncate text-sm" title={quote.notes || ""}>
                                            {quote.notes || "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            quote.status === 'Completed' ? 'default' : // default is roughly primary/black/dark
                                                quote.status === 'Pending' ? 'secondary' : // gray/secondary
                                                    quote.status === 'OfferSent' ? 'outline' :
                                                        'destructive'
                                        }>
                                            {quote.status === 'Pending' ? 'Bekliyor' :
                                                quote.status === 'OfferSent' ? 'Teklif İletildi' :
                                                    quote.status === 'Completed' ? 'Tamamlandı' :
                                                        quote.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(quote.createdAt).toLocaleDateString("tr-TR")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/quotes/${quote.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await db.quoteRequest.delete({ where: { id: quote.id } })
                                            }}>
                                                <Button variant="ghost" size="icon" type="submit">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {quotes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Henüz teklif talebi yok.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
