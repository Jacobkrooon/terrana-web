'use client'
import { useState } from 'react'
import StandModal from './StandModal'

export default function NewStandButton({ planId }: { planId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-[#1B4332] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2D6A4F]">
        + Ny avdelning
      </button>
      {open && <StandModal planId={planId} onClose={() => setOpen(false)} />}
    </>
  )
}
