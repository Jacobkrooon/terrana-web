import { createClient } from '@/lib/supabase/server'

const SOURCE_LABEL: Record<string, string> = {
  manual: 'Manuell',
  forestand_import: 'Forestand XML',
  sgd_auto: 'SGD Auto',
}

export default async function PlanerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: plans } = await supabase
    .from('forest_plans')
    .select(`
      id, name, valid_from, valid_to, source, created_at,
      area:areas(name, area_hectares),
      stands(count)
    `)
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1B4332]">Skogsbruksplaner</h1>
        <span className="text-sm text-[#8FAF97]">{plans?.length ?? 0} planer</span>
      </div>

      {plans && plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map(plan => {
            const area = plan.area as any
            const standCount = (plan.stands as any)?.[0]?.count ?? 0
            return (
              <div key={plan.id} className="bg-white rounded-2xl border border-[#C8DDD0] p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-[#1A2E1E] text-lg">{plan.name}</h2>
                    <p className="text-[#5A7263] text-sm mt-1">
                      Område: {area?.name ?? '–'}
                      {area?.area_hectares != null && ` · ${Number(area.area_hectares).toFixed(1)} ha`}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#EAF4EE] text-[#1B4332]">
                    {SOURCE_LABEL[plan.source] ?? plan.source}
                  </span>
                </div>

                <div className="flex gap-6 mt-4 pt-4 border-t border-[#F0F0F0] text-sm">
                  <div>
                    <p className="text-[#8FAF97] text-xs uppercase tracking-wide mb-1">Avdelningar</p>
                    <p className="font-bold text-[#1B4332] text-xl">{standCount}</p>
                  </div>
                  {plan.valid_from && plan.valid_to && (
                    <div>
                      <p className="text-[#8FAF97] text-xs uppercase tracking-wide mb-1">Giltighetstid</p>
                      <p className="font-semibold text-[#1A2E1E]">
                        {plan.valid_from.slice(0, 4)}–{plan.valid_to.slice(0, 4)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[#8FAF97] text-xs uppercase tracking-wide mb-1">Skapad</p>
                    <p className="font-semibold text-[#1A2E1E]">
                      {new Date(plan.created_at).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#C8DDD0] px-6 py-16 text-center">
          <span className="text-4xl">📄</span>
          <p className="mt-4 font-semibold text-[#1A2E1E]">Inga skogsbruksplaner</p>
          <p className="text-sm text-[#8FAF97] mt-1">Skapa planer via ett område i iOS-appen</p>
        </div>
      )}
    </div>
  )
}
