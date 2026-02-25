"use client"

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

type Toast = { id: number; message: string; type: ToastType }

// Global add function — import and call from anywhere
export let addToast: (message: string, type?: ToastType) => void = () => { }

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        addToast = (message, type = 'success') => {
            const id = Date.now()
            setToasts(prev => [...prev, { id, message, type }])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, 3500)
        }
    }, [])

    const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

    const config = {
        success: {
            icon: CheckCircle2,
            border: 'border-l-green-500',
            iconColor: 'text-green-500',
            bg: 'bg-card',
        },
        error: {
            icon: XCircle,
            border: 'border-l-red-500',
            iconColor: 'text-red-500',
            bg: 'bg-card',
        },
        info: {
            icon: Info,
            border: 'border-l-blue-400',
            iconColor: 'text-blue-400',
            bg: 'bg-card',
        },
    }

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
            {toasts.map(t => {
                const { icon: Icon, border, iconColor, bg } = config[t.type]
                return (
                    <div
                        key={t.id}
                        className={`
                            pointer-events-auto
                            flex items-start gap-3
                            min-w-[280px] max-w-sm
                            ${bg} ${border}
                            border border-l-4 rounded-lg shadow-xl
                            px-4 py-3
                            animate-in slide-in-from-right-4 fade-in
                            duration-300
                        `}
                        style={{ animation: 'slideIn 0.3s ease' }}
                    >
                        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
                        <p className="text-sm font-medium text-foreground flex-1">{t.message}</p>
                        <button
                            onClick={() => remove(t.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors ml-1 flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            })}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(110%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    )
}
