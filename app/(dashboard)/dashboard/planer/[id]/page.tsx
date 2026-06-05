import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NewStandButton from './NewStandButton'
import StandActions from './StandActions'

const CUTTING_CLASS_LABEL: Record<string, string> = {
  K1: 'K1 – Kalmark', R1: 'R1 – Röjning',
  G1: 'G1 – Gallring tidig', G2: 'G2 – Gallring sen',
  S1: 'S1 – Slutavv. tidig', S2: 'S2 – Slutavv. sen', S3: 'S3 – Slutavv. gammal',
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plan } = await supabase
    .from('forest_plans')
    .select('id, name, valid_from, valid_to, source, area:areas(name)')
    .eq('id', params.id)
    .eq('owner_id', user!.id)
    .single()

  if (!plan) notFound()

  const { data: stands } = await supabase
    .from('stands')
    .select('id, stand_number, area_ha, tree_species, age_years, volume_m3_per_ha, cutting_class, description')
    .eq('plan_id', params.id)
    .order('stand_number')

  const totalHa = stands?.reduce((s, st) => s + (st.area_ha ?? 0), 0) ?? 0
  const totalVol = stands?.reduce((s, st) => s + ((st.volume_m3_per_ha ?? 0) * (st.area_ha ?? 0)), 0) ?? 0

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/planer" className="text-sm text-[#8FAF97] hover:text-[#1B4332] mb-2 inline-block">
          ← Tillbaka till planer
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1B4332]">{plan.name}</h1>
            <p className="text-sm text-[#5A7263] mt-1">
              {(plan.area as any)?.name && `Område: ${(plan.area as any).name} · `}
              {stands?.length ?? 0} avdelningar
            </p>
          </div>
          <div className="flex gap-2">
            <a href={`/dashboard/planer/${params.id}/export`} target="_blank"
              className="border border-[#C8DDD0] text-[#5A7263] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#F8FBF9]">
              Exportera PDF
            </a>
            <NewStandButton planId={params.id} />
          </div>
        </div>
      </div>

      {/* Summering */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-[#C8DDD0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1B4332]">{stands?.length ?? 0}</p>
          <p className="text-xs text-[#8FAF97] mt-1 uppercase tracking-wide">Avdelningar</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#C8DDD0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1B4332]">{totalHa.toFixed(1)}</p>
          <p className="text-xs text-[#8FAF97] mt-1 uppercase tracking-wide">Hektar totalt</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#C8DDD0] p-4 text-center">
          <p className="text-2xl font-bold text-[#1B4332]">{Math.round(totalVol)}</p>
          <p className="text-xs text-[#8FAF97] mt-1 uppercase tracking-wide">m³sk totalt</p>
        </div>
      </div>

      {/* Avdelningstabell */}
      <div className="bg-white rounded-2xl border border-[#C8DDD0] overflow-hidden">
        {stands && stands.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-[#F8FBF9]">
              <tr>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Avd.</th>
                <th className="text-right px-4 py-3 text-[#8FAF97] font-semibold">Areal (ha)</th>
                <th className="text-left px-4 py-3 text-[#8FAF97] font-semibold">Trädslag</th>
                <th className="text-right px-4 py-3 text-[#8FAF97] font-semibold">Ålder</th>
                <th className="text-right px-4 py-3 text-[#8FAF97] font-semibold">m³sk/ha</th>
                <th className="text-left px-4 py-3 text-[#8FAF97] font-semibold">Huggningsklass</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {stands.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? '' : 'bg-[#F8FBF9]'}>
                  <td className="px-6 py-3 font-bold text-[#1B4332]">{s.stand_number}</td>
                  <td className="px-4 py-3 text-right text-[#5A7263]">{s.area_ha?.toFixed(2) ?? '–'}</td>
                  <td className="px-4 py-3 text-[#5A7263]">{s.tree_species ?? '–'}</td>
                  <td className="px-4 py-3 text-right text-[#5A7263]">{s.age_years ?? '–'}</td>
                  <td className="px-4 py-3 text-right text-[#5A7263]">{s.volume_m3_per_ha ?? '–'}</td>
                  <td className="px-4 py-3">
                    {s.cutting_class ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EAF4EE] text-[#1B4332]">
                        {s.cutting_class}
                      </span>
                    ) : '–'}
                  </td>
                  <td className="px-4 py-3">
                    <StandActions stand={s} planId={params.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-[#1A2E1E]">Inga avdelningar ännu</p>
            <p className="text-sm text-[#8FAF97] mt-1">Klicka "Ny avdelning" för att börja</p>
          </div>
        )}
      </div>
    </div>
  )
}
