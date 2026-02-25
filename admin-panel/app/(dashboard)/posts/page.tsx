import Link from "next/link"
import { Plus, MoreHorizontal, FileText, Pencil, Trash2 } from "lucide-react"
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

export default async function PostsPage() {
    const posts = await db.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Yazıları</h1>
                    <p className="text-muted-foreground">İçeriklerinizi ve makalelerinizi yönetin.</p>
                </div>
                <Link href="/posts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Yazı
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Yazı Listesi</CardTitle>
                    <CardDescription>
                        Toplam {posts.length} yazı bulunmaktadır.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Yayın Tarihi</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {post.title}
                                        <div className="text-xs text-muted-foreground">/{post.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.status === 'Published' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {post.status === 'Published' ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/posts/${post.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await db.blogPost.delete({ where: { id: post.id } })
                                                revalidatePath("/posts")
                                            }}>
                                                <Button variant="ghost" size="icon" type="submit">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {posts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Henüz hiç yazı eklenmemiş.
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
