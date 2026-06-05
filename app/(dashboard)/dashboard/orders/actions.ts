'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('work_orders').insert({
    sender_id: user.id,
    recipient_id: formData.get('recipient_id') as string,
    area_id: formData.get('area_id') as string || null,
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    status: 'skickad',
  })
  revalidatePath('/dashboard/orders')
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  await supabase.from('work_orders').update({ status }).eq('id', orderId)
  revalidatePath('/dashboard/orders')
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient()
  await supabase.from('work_orders').delete().eq('id', orderId)
  revalidatePath('/dashboard/orders')
}
