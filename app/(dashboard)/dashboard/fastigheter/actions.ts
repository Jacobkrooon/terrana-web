'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFastighet(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Inte inloggad')

  const arealHa = formData.get('areal_ha') as string
  const arealM2 = arealHa ? Math.round(parseFloat(arealHa) * 10000) : null

  const { error } = await supabase.from('fastigheter').insert({
    owner_id: user.id,
    beteckning: (formData.get('beteckning') as string).trim(),
    trakt: (formData.get('trakt') as string)?.trim() || null,
    block: (formData.get('block') as string)?.trim() || null,
    enhet: (formData.get('enhet') as string)?.trim() || null,
    kommun_namn: (formData.get('kommun_namn') as string)?.trim() || null,
    lan_namn: (formData.get('lan_namn') as string)?.trim() || null,
    areal_m2: arealM2,
    notes: (formData.get('notes') as string)?.trim() || null,
    source: 'manual',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/fastigheter')
}

export async function updateFastighet(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Inte inloggad')

  const arealHa = formData.get('areal_ha') as string
  const arealM2 = arealHa ? Math.round(parseFloat(arealHa) * 10000) : null

  const { error } = await supabase
    .from('fastigheter')
    .update({
      beteckning: (formData.get('beteckning') as string).trim(),
      trakt: (formData.get('trakt') as string)?.trim() || null,
      block: (formData.get('block') as string)?.trim() || null,
      enhet: (formData.get('enhet') as string)?.trim() || null,
      kommun_namn: (formData.get('kommun_namn') as string)?.trim() || null,
      lan_namn: (formData.get('lan_namn') as string)?.trim() || null,
      areal_m2: arealM2,
      notes: (formData.get('notes') as string)?.trim() || null,
    })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/fastigheter')
}

export async function deleteFastighet(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Inte inloggad')

  const { error } = await supabase
    .from('fastigheter')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/fastigheter')
}
