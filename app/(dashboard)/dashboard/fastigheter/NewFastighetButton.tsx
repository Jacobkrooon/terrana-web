'use client'

import { useState } from 'react'
import FastighetModal from './FastighetModal'

export default function NewFastighetButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 text-sm font-semibold bg-[#1B4332] text-white rounded-lg hover:bg-[#143527]"
      >
        + Ny fastighet
      </button>
      {open && <FastighetModal onClose={() => setOpen(false)} />}
    </>
  )
}
