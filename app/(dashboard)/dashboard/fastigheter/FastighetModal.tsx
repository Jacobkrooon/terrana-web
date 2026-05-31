'use client'

import { useState, useRef } from 'react'
import { createFastighet, updateFastighet } from './actions'

interface Fastighet {
  id: string
  beteckning: string
  trakt: string | null
  block: string | null
  enhet: string | null
  kommun_namn: string | null
  lan_namn: string | null
  areal_m2: number | null
  notes: string | null
}

interface Props {
  fastighet?: Fastighet
  onClose: () => void
}

export default function FastighetModal({ fastighet, onClose }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const arealHa = fastighet?.areal_m2 != null
    ? (fastighet.areal_m2 / 10000).toFixed(4)
    : ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      if (fastighet) {
        await updateFastighet(fastighet.id, formData)
      } else {
        await createFastighet(formData)
      }
      onClose()
    } catch (err: any) {
      setError(err.message ?? 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EFE9]">
          <h2 className="text-lg font-bold text-[#1B4332]">
            {fastighet ? 'Redigera fastighet' : 'Ny fastighet'}
          </h2>
          <button onClick={onClose} className="text-[#8FAF97] hover:text-[#1B4332] text-xl leading-none">&times;</button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">
              Beteckning <span className="text-red-500">*</span>
            </label>
            <input
              name="beteckning"
              required
              defaultValue={fastighet?.beteckning ?? ''}
              placeholder="T.ex. Örby 1:23"
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Trakt</label>
              <input
                name="trakt"
                defaultValue={fastighet?.trakt ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Block</label>
              <input
                name="block"
                defaultValue={fastighet?.block ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Enhet</label>
              <input
                name="enhet"
                defaultValue={fastighet?.enhet ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Kommun</label>
              <input
                name="kommun_namn"
                defaultValue={fastighet?.kommun_namn ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Län</label>
              <input
                name="lan_namn"
                defaultValue={fastighet?.lan_namn ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Areal (ha)</label>
            <input
              name="areal_ha"
              type="number"
              step="0.0001"
              min="0"
              defaultValue={arealHa}
              placeholder="T.ex. 12.5"
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8FAF97] uppercase tracking-wide mb-1">Anteckningar</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={fastighet?.notes ?? ''}
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm text-[#1A2E1E] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#5A7263] hover:text-[#1B4332]"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold bg-[#1B4332] text-white rounded-lg hover:bg-[#143527] disabled:opacity-50"
            >
              {loading ? 'Sparar…' : fastighet ? 'Spara ändringar' : 'Lägg till'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
