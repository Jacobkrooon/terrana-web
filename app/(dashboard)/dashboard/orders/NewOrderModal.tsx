'use client'
import { useState } from 'react'
import { createOrder } from './actions'

interface Props {
  rojare: { id: string; full_name: string }[]
  areas: { id: string; name: string }[]
  onClose: () => void
}

export default function NewOrderModal({ rojare, areas, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (!fd.get('recipient_id')) { setError('Välj en mottagare.'); return }
    if (!fd.get('title')) { setError('Ange en titel.'); return }
    setLoading(true)
    try {
      await createOrder(fd)
      onClose()
    } catch {
      setError('Något gick fel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#EAF4EE]">
          <h2 className="text-lg font-bold text-[#1B4332]">Ny arbetsorder</h2>
          <button onClick={onClose} className="text-[#8FAF97] hover:text-[#1B4332] text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A7263] mb-1">Titel *</label>
            <input name="title" required placeholder="t.ex. Röjning område Nord"
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5A7263] mb-1">Mottagare *</label>
            <select name="recipient_id" required
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]">
              <option value="">Välj röjare…</option>
              {rojare.map(r => <option key={r.id} value={r.id}>{r.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5A7263] mb-1">Område (valfritt)</label>
            <select name="area_id"
              className="w-full border border-[#C8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]">
              <option value="">Välj område…</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5A7263] mb-1">Beskrivning</label>
            <textarea name="description" rows={3} placeholder="Instruktioner till röjaren…"
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
              {loading ? 'Skapar…' : 'Skicka order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
