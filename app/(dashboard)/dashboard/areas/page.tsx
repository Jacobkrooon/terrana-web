import { createClient } from '@/lib/supabase/server'

const TYPE_LABELS: Record<string, string> = {
  slutavverkning: 'Slutavverkning',
  gallring: 'Gallring',
  rojning: 'Röjning',
  plantering: 'Plantering',
  naturvard: 'Naturvård',
  ovrig: 'Övrigt',
}

const TYPE_COLORS: Record<string, string> = {
  slutavverkning: 'bg-red-100 text-red-700',
  gallring: 'bg-orange-100 text-orange-700',
  rojning: 'bg-green-100 text-green-700',
  plantering: 'bg-blue-100 text-blue-700',
  naturvard: 'bg-teal-100 text-teal-700',
  ovrig: 'bg-gray-100 text-gray-600',
}

export default async function AreasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: areas } = await supabase
    .from('areas')
    .select('id, name, area_hectares, area_type, created_at, fastighet:fastigheter(beteckning)')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  const totalHa = areas?.reduce((s, a) => s + (Number(a.area_hectares) || 0), 0) ?? 0

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1B4332]">Områden</h1>
        <span className="text-sm text-[#8FAF97]">
          {areas?.length ?? 0} områden · {totalHa.toFixed(1)} ha totalt
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#C8DDD0] overflow-hidden">
        {areas && areas.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-[#F8FBF9]">
              <tr>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Namn</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Fastighet</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Typ</th>
                <th className="text-right px-6 py-3 text-[#8FAF97] font-semibold">Areal</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Skapad</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area, i) => (
                <tr key={area.id} className={i % 2 === 0 ? '' : 'bg-[#F8FBF9]'}>
                  <td className="px-6 py-4 font-semibold text-[#1A2E1E]">{area.name}</td>
                  <td className="px-6 py-4 text-[#5A7263]">
                    {(area.fastighet as any)?.beteckning ?? '–'}
                  </td>
                  <td className="px-6 py-4">
                    {area.area_type ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[area.area_type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {TYPE_LABELS[area.area_type] ?? area.area_type}
                      </span>
                    ) : '–'}
                  </td>
                  <td className="px-6 py-4 text-right text-[#5A7263]">
                    {area.area_hectares != null ? `${Number(area.area_hectares).toFixed(2)} ha` : '–'}
                  </td>
                  <td className="px-6 py-4 text-[#8FAF97]">
                    {new Date(area.created_at).toLocaleDateString('sv-SE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="text-4xl">🌲</span>
            <p className="mt-4 font-semibold text-[#1A2E1E]">Inga områden registrerade</p>
            <p className="text-sm text-[#8FAF97] mt-1">Rita områden i iOS-appen</p>
          </div>
        )}
      </div>
    </div>
  )
}
