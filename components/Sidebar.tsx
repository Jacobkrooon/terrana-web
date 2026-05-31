'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Översikt', icon: '🏠' },
  { href: '/dashboard/fastigheter', label: 'Fastigheter', icon: '🏡' },
  { href: '/dashboard/areas', label: 'Områden', icon: '🌲' },
  { href: '/dashboard/orders', label: 'Arbetsorder', icon: '📋' },
  { href: '/dashboard/planer', label: 'Skogsbruksplaner', icon: '📄' },
]

interface Props {
  profile: { full_name: string; role: string; email: string } | null
}

export default function Sidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-[#1B4332] flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-[#0d2b1e]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌲</span>
          <span className="text-white font-bold text-xl tracking-widest">TERRANA</span>
        </div>
        <p className="text-[#74C69D] text-xs mt-1 ml-9">Adminportal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? 'bg-[#E8B84B] text-[#1B4332]'
                  : 'text-[rgba(255,255,255,0.7)] hover:bg-[#2D6A4F] hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Profil + utloggning */}
      <div className="px-4 py-6 border-t border-[#0d2b1e]">
        {profile && (
          <div className="mb-4 px-2">
            <p className="text-white font-semibold text-sm truncate">{profile.full_name}</p>
            <p className="text-[#74C69D] text-xs truncate">{profile.email}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full text-left px-4 py-2 text-[rgba(255,255,255,0.5)] hover:text-white text-sm transition-colors"
        >
          Logga ut →
        </button>
      </div>
    </aside>
  )
}
