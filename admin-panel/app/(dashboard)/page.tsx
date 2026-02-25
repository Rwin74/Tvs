"use client"

import { useState, useEffect } from "react"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, ShoppingCart, Users, Globe, Loader2, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [publishing, setPublishing] = useState(false)
  const [stats, setStats] = useState({ products: 0, posts: 0, pendingQuotes: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetch('/admin/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => { })
      .finally(() => setStatsLoading(false))
  }, [])

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const res = await fetch('/admin/api/publish', { method: 'POST' })
      if (!res.ok) throw new Error('Yayınlama hatası')
      const data = await res.json()
      alert(`Site başarıyla güncellendi! ${data.count} ürün yayınlandı.`)
    } catch (error) {
      console.error(error)
      alert('Yayınlama sırasında bir hata oluştu.')
    } finally {
      setPublishing(false)
    }
  }

  const statVal = (n: number) => statsLoading ? '...' : String(n)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">TVS Tekstil Yönetim Paneline Hoşgeldiniz.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePublish} disabled={publishing}>
            {publishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            {publishing ? 'Yayınlanıyor...' : 'Siteyi Güncelle'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statVal(stats.products)}</div>
            <p className="text-xs text-muted-foreground">Katalogdaki tüm ürünler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Yazıları</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statVal(stats.posts)}</div>
            <p className="text-xs text-muted-foreground">Toplam içerik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Teklifler</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statVal(stats.pendingQuotes)}</div>
            <p className="text-xs text-muted-foreground">Yanıt bekleyen B2B talepleri</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hızlı Erişim</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 pt-1">
              <Link href="/products/new" className="text-xs text-primary hover:underline">+ Yeni Ürün Ekle</Link>
              <Link href="/posts/new" className="text-xs text-primary hover:underline">+ Yeni Blog Yazısı</Link>
              <Link href="/quotes" className="text-xs text-primary hover:underline">→ Teklifleri Görüntüle</Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Son Eklenen Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RecentProducts />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/products/new">
              <Button variant="ghost" className="w-full justify-start">
                <PlusIcon className="mr-2 h-4 w-4" />
                Yeni Ürün Ekle
              </Button>
            </Link>
            <Link href="/posts/new">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Yeni Blog Yazısı
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Kategori Yönetimi
              </Button>
            </Link>
            <Link href="/quotes">
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Teklif Taleplerini Görüntüle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecentProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/admin/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.slice(0, 5))
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground">Yükleniyor...</p>
  if (products.length === 0) return <p className="text-sm text-muted-foreground">Henüz ürün eklenmemiş.</p>

  return (
    <div className="space-y-2">
      {products.map((p) => (
        <div key={p.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.slug}</p>
          </div>
          <span className="text-xs text-muted-foreground">{Number(p.basePrice).toFixed(2)} TL</span>
        </div>
      ))}
    </div>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
