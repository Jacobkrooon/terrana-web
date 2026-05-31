'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F8FBF9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#1B4332] mb-4">
            <span className="text-3xl">🌲</span>
          </div>
          <h1 className="text-3xl font-bold tracking-[0.2em] text-[#1B4332]">TERRANA</h1>
          <p className="text-sm text-[#8FAF97] mt-1">Adminportal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-postadress"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-white border border-[#C8DDD0] rounded-xl px-4 py-4 text-[#1A2E1E] placeholder-[#8FAF97] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-white border border-[#C8DDD0] rounded-xl px-4 py-4 text-[#1A2E1E] placeholder-[#8FAF97] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B4332] text-white font-bold rounded-xl py-4 hover:bg-[#2D6A4F] transition-colors disabled:opacity-60"
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  )
}
