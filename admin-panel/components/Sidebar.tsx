"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    FileText,
    Users,
    Settings,
    Briefcase,
    PlusCircle,
    List,
    Tags,
    Palette,
    Image as ImageIcon
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        variant: "default",
    },
    {
        title: "Ürün Yönetimi",
        href: "/products",
        icon: Package,
        variant: "ghost",
        submenu: [
            { title: "Ürün Listesi", href: "/products", icon: List },
            { title: "Yeni Ürün Ekle", href: "/products/new", icon: PlusCircle },
            { title: "Kategoriler", href: "/categories", icon: Tags },
        ]
    },
    {
        title: "İçerik Yönetimi",
        href: "/posts",
        icon: FileText,
        variant: "ghost",
        submenu: [
            { title: "Blog Yazıları", href: "/posts", icon: FileText },
            { title: "Yeni Yazı Ekle", href: "/posts/new", icon: PlusCircle },
        ]
    },
    {
        title: "B2B Yönetimi",
        href: "/quotes",
        icon: Briefcase,
        variant: "ghost",
        submenu: [
            { title: "Gelen Teklifler", href: "/quotes", icon: Briefcase },
        ]
    },

]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="relative hidden border-r bg-muted/40 lg:block w-64 h-screen overflow-y-auto">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Package className="h-6 w-6" />
                    <span className="">TVS Admin</span>
                </Link>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
                    {sidebarItems.map((item, index) => (
                        <div key={index} className="mb-2">
                            {item.submenu ? (
                                <>
                                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all">
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </div>
                                    <div className="pl-6 grid gap-1">
                                        {item.submenu.map((sub, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={sub.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                                    pathname === sub.href
                                                        ? "bg-muted text-primary"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                <sub.icon className="h-4 w-4" />
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                        pathname === item.href
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    )
}
