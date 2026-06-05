'use client'
import { useState } from 'react'
import NewOrderModal from './NewOrderModal'

interface Props {
  rojare: { id: string; full_name: string }[]
  areas: { id: string; name: string }[]
}

export default function NewOrderButton({ rojare, areas }: Props) {
  const [open, setOpen] = useState(false)
  if (rojare.length === 0) return null
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-[#1B4332] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2D6A4F]">
        + Ny arbetsorder
      </button>
      {open && <NewOrderModal rojare={rojare} areas={areas} onClose={() => setOpen(false)} />}
    </>
  )
}
