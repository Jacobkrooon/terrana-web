'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createStand(planId: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('stands').insert({
    plan_id: planId,
    stand_number: formData.get('stand_number') as string,
    area_ha: formData.get('area_ha') ? Number(formData.get('area_ha')) : null,
    tree_species: formData.get('tree_species') as string || null,
    age_years: formData.get('age_years') ? Number(formData.get('age_years')) : null,
    volume_m3_per_ha: formData.get('volume_m3_per_ha') ? Number(formData.get('volume_m3_per_ha')) : null,
    cutting_class: formData.get('cutting_class') as string || null,
    description: formData.get('description') as string || null,
  })
  revalidatePath(`/dashboard/planer/${planId}`)
}

export async function updateStand(standId: string, planId: string, formData: FormData) {
  const supabase = await createClient()
  await supabase.from('stands').update({
    stand_number: formData.get('stand_number') as string,
    area_ha: formData.get('area_ha') ? Number(formData.get('area_ha')) : null,
    tree_species: formData.get('tree_species') as string || null,
    age_years: formData.get('age_years') ? Number(formData.get('age_years')) : null,
    volume_m3_per_ha: formData.get('volume_m3_per_ha') ? Number(formData.get('volume_m3_per_ha')) : null,
    cutting_class: formData.get('cutting_class') as string || null,
    description: formData.get('description') as string || null,
  }).eq('id', standId)
  revalidatePath(`/dashboard/planer/${planId}`)
}

export async function deleteStand(standId: string, planId: string) {
  const supabase = await createClient()
  await supabase.from('stands').delete().eq('id', standId)
  revalidatePath(`/dashboard/planer/${planId}`)
}
