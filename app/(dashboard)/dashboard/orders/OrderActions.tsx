'use client'
import { useState } from 'react'
import { updateOrderStatus, deleteOrder } from './actions'

const NEXT_STATUS: Record<string, { label: string; value: string }> = {
  skickad: { label: 'Markera pågående', value: 'pagaende' },
  pagaende: { label: 'Markera klar', value: 'klar' },
}

export default function OrderActions({ orderId, status, isSender }: {
  orderId: string
  status: string
  isSender: boolean
}) {
  const [loading, setLoading] = useState(false)

  async function handleStatus(newStatus: string) {
    setLoading(true)
    await updateOrderStatus(orderId, newStatus)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Radera denna arbetsorder?')) return
    setLoading(true)
    await deleteOrder(orderId)
  }

  const next = NEXT_STATUS[status]

  return (
    <div className="flex gap-2 items-center">
      {next && (
        <button onClick={() => handleStatus(next.value)} disabled={loading}
          className="text-xs text-[#2D6A4F] font-semibold hover:underline disabled:opacity-50">
          {loading ? '…' : next.label}
        </button>
      )}
      {isSender && status === 'skickad' && (
        <button onClick={handleDelete} disabled={loading}
          className="text-xs text-red-500 font-semibold hover:underline disabled:opacity-50">
          Ta bort
        </button>
      )}
    </div>
  )
}
