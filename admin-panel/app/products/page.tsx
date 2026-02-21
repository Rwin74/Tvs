import Link from "next/link"
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"

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

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const products = await db.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            variants: true,
            media: true
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ürünler</h1>
                    <p className="text-muted-foreground">Kataloğunuzdaki tüm ürünleri yönetin.</p>
                </div>
                <Link href="/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ürün
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ürün Listesi</CardTitle>
                    <CardDescription>
                        Toplam {products.length} ürün listeleniyor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Görsel</TableHead>
                                <TableHead>Ürün Adı</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Fiyat</TableHead>
                                <TableHead className="text-right">Stok</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0)
                                const status = product.isActive ? (totalStock > 0 ? "Aktif" : "Tükendi") : "Pasif"

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.media && product.media.length > 0 ? (
                                                <div className="h-10 w-10 rounded overflow-hidden">
                                                    <img
                                                        src={product.media[0].filePath}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                    IMG
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product.name}
                                            <div className="text-xs text-muted-foreground">{product.slug}</div>
                                        </TableCell>
                                        <TableCell>{product.categoryId || "-"}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === 'Aktif' ? 'bg-green-100 text-green-800' :
                                                status === 'Tükendi' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{Number(product.basePrice).toFixed(2)} TL</TableCell>
                                        <TableCell className="text-right">{totalStock}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/products/${product.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form action={async () => {
                                                    "use server"
                                                    await db.product.delete({ where: { id: product.id } })
                                                }}>
                                                    <Button variant="ghost" size="icon" className="text-destructive">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
