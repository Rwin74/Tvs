"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // Successful login, router.push directly points to /admin thanks to basePath
                router.push("/");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Giriş başarısız.");
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="text-3xl font-bold tracking-tight text-primary mb-2">
                        TVS<span className="font-light text-muted-foreground ml-1">T E K S T İ L</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mt-2">Yönetici Girişi</h1>
                    <p className="text-sm text-gray-500 mt-1">Lütfen bilgilerinizi giriniz.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@tvstekstil.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={loading}>
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </Button>
                </form>
            </div>

            <div className="mt-8 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} TVS Tekstil. Tüm hakları saklıdır.
            </div>
        </div>
    );
}
