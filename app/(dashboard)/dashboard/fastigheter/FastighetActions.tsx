'use client'

import { useState } from 'react'
import FastighetModal from './FastighetModal'
import { deleteFastighet } from './actions'

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
  fastighet: Fastighet
}

export default function FastighetActions({ fastighet }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteFastighet(fastighet.id)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setEditOpen(true)}
          className="px-3 py-1 text-xs font-semibold text-[#1B4332] border border-[#C8DDD0] rounded-lg hover:bg-[#F0F7F2]"
        >
          Redigera
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-3 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
        >
          Ta bort
        </button>
      </div>

      {editOpen && (
        <FastighetModal fastighet={fastighet} onClose={() => setEditOpen(false)} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-[#1B4332] mb-2">Ta bort fastighet?</h2>
            <p className="text-sm text-[#5A7263] mb-6">
              <strong>{fastighet.beteckning}</strong> raderas permanent och kan inte återställas.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-sm font-semibold text-[#5A7263] hover:text-[#1B4332]"
              >
                Avbryt
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Tar bort…' : 'Ta bort'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
