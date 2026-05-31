import { createClient } from '@/lib/supabase/server'

export default async function FastigheterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: fastigheter } = await supabase
    .from('fastigheter')
    .select('id, beteckning, trakt, kommun_namn, lan_namn, areal_hektar, source, created_at')
    .eq('owner_id', user!.id)
    .order('beteckning')

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1B4332]">Fastigheter</h1>
        <span className="text-sm text-[#8FAF97]">{fastigheter?.length ?? 0} registrerade</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#C8DDD0] overflow-hidden">
        {fastigheter && fastigheter.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-[#F8FBF9]">
              <tr>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Beteckning</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Kommun</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Län</th>
                <th className="text-right px-6 py-3 text-[#8FAF97] font-semibold">Areal</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Källa</th>
              </tr>
            </thead>
            <tbody>
              {fastigheter.map((f, i) => (
                <tr key={f.id} className={i % 2 === 0 ? '' : 'bg-[#F8FBF9]'}>
                  <td className="px-6 py-4 font-semibold text-[#1B4332]">{f.beteckning}</td>
                  <td className="px-6 py-4 text-[#5A7263]">{f.kommun_namn ?? '–'}</td>
                  <td className="px-6 py-4 text-[#5A7263]">{f.lan_namn ?? '–'}</td>
                  <td className="px-6 py-4 text-right text-[#5A7263]">
                    {f.areal_hektar != null ? `${Number(f.areal_hektar).toFixed(1)} ha` : '–'}
                  </td>
                  <td className="px-6 py-4">
                    {f.source === 'lantmateriet' ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Lantmäteriet</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">Manuell</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="text-4xl">🏡</span>
            <p className="mt-4 font-semibold text-[#1A2E1E]">Inga fastigheter registrerade</p>
            <p className="text-sm text-[#8FAF97] mt-1">Lägg till fastigheter i iOS-appen</p>
          </div>
        )}
      </div>
    </div>
  )
}
