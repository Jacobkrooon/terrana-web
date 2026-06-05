'use client'
import { useState } from 'react'
import { createStand, updateStand } from './actions'

const CUTTING_CLASSES = [
  { value: 'K1', label: 'K1 – Kalmark' },
  { value: 'R1', label: 'R1 – Röjningsskog' },
  { value: 'G1', label: 'G1 – Gallringsskog, tidig' },
  { value: 'G2', label: 'G2 – Gallringsskog, sen' },
  { value: 'S1', label: 'S1 – Slutavverkningsskog, tidig' },
  { value: 'S2', label: 'S2 – Slutavverkningsskog, sen' },
  { value: 'S3', label: 'S3 – Slutavverkningsskog, gammal' },
]

interface Stand {
  id: string
  stand_number: string
  area_ha: number | null
  tree_species: string | null
  age_years: number | null
  volume_m3_per_ha: number | null
  cutting_class: string | null
  description: string | null
}

interface Props {
  planId: string
  stand?: Stand
  onClose: () => void
}

export default function StandModal({ planId, stand, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      if (stand) {
        await updateStand(stand.id, planId, fd)
      } else {
        await createStand(planId, fd)
      }
      onClose()
    } catch {
      setError('Något gick fel, försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#EAF4EE]">
          <h2 className="text-lg font-bold text-[#1B4332]">
            {stand ? 'Redigera avdelning' : 'Ny avdelning'}
          </h2>
          <button onClick={onClose} className="text-[#8FAF97] hover:text-[#1B4332] text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A7263] mb-1">Avdelningsnummer *</label>
              <input name="stand_number" required defaultValue={stand?.stand_number}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A7263] mb-1">Areal (ha)</label>
              <input name="area_ha" type="number" step="0.01" defaultValue={stand?.area_ha ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A7263] mb-1">Trädslag</label>
              <input name="tree_species" defaultValue={stand?.tree_species ?? ''}
                placeholder="t.ex. Gran, Tall, Björk"
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A7263] mb-1">Ålder (år)</label>
              <input name="age_years" type="number" defaultValue={stand?.age_years ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A7263] mb-1">Volym (m³sk/ha)</label>
              <input name="volume_m3_per_ha" type="number" step="0.1" defaultValue={stand?.volume_m3_per_ha ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A7263] mb-1">Huggningsklass</label>
              <select name="cutting_class" defaultValue={stand?.cutting_class ?? ''}
                className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]">
                <option value="">Välj…</option>
                {CUTTING_CLASSES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A7263] mb-1">Beskrivning</label>
            <textarea name="description" rows={3} defaultValue={stand?.description ?? ''}
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#C8DDD0] text-[#5A7263] rounded-xl py-2.5 text-sm font-semibold hover:bg-[#F8FBF9]">
              Avbryt
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2D6A4F] disabled:opacity-50">
              {loading ? 'Sparar…' : (stand ? 'Spara ändringar' : 'Skapa avdelning')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
