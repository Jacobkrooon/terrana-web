'use client'
import { useState } from 'react'
import { deleteStand } from './actions'
import StandModal from './StandModal'

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

export default function StandActions({ stand, planId }: { stand: Stand; planId: string }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Radera avdelning ${stand.stand_number}?`)) return
    setDeleting(true)
    await deleteStand(stand.id, planId)
  }

  return (
    <>
      <div className="flex gap-2">
        <button onClick={() => setEditOpen(true)}
          className="text-xs text-[#2D6A4F] font-semibold hover:underline">
          Redigera
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="text-xs text-red-500 font-semibold hover:underline disabled:opacity-50">
          {deleting ? '…' : 'Ta bort'}
        </button>
      </div>
      {editOpen && <StandModal planId={planId} stand={stand} onClose={() => setEditOpen(false)} />}
    </>
  )
}
