import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { count: areaCount },
    { count: fastighetCount },
    { count: orderCount },
    { count: planCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('areas').select('*', { count: 'exact', head: true }).eq('owner_id', user!.id),
    supabase.from('fastigheter').select('*', { count: 'exact', head: true }).eq('owner_id', user!.id),
    supabase.from('work_orders').select('*', { count: 'exact', head: true })
      .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`).neq('status', 'klar'),
    supabase.from('forest_plans').select('*', { count: 'exact', head: true }).eq('owner_id', user!.id),
    supabase.from('work_orders')
      .select('id, title, status, created_at')
      .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Fastigheter', value: fastighetCount ?? 0, icon: '🏡' },
    { label: 'Områden', value: areaCount ?? 0, icon: '🌲' },
    { label: 'Aktiva order', value: orderCount ?? 0, icon: '📋' },
    { label: 'Skogsbruksplaner', value: planCount ?? 0, icon: '📄' },
  ]

  const statusLabel: Record<string, string> = {
    skickad: 'Skickad',
    pagaende: 'Pågående',
    klar: 'Klar',
  }
  const statusColor: Record<string, string> = {
    skickad: 'bg-blue-100 text-blue-700',
    pagaende: 'bg-yellow-100 text-yellow-700',
    klar: 'bg-green-100 text-green-700',
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-[#1B4332] mb-8">Översikt</h1>

      {/* Statistikkort */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#C8DDD0]">
            <span className="text-3xl">{stat.icon}</span>
            <p className="text-3xl font-bold text-[#1B4332] mt-3">{stat.value}</p>
            <p className="text-sm text-[#8FAF97] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Senaste arbetsorder */}
      <div className="bg-white rounded-2xl border border-[#C8DDD0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#C8DDD0]">
          <h2 className="font-bold text-[#1A2E1E]">Senaste arbetsorder</h2>
        </div>
        {recentOrders && recentOrders.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-[#F8FBF9]">
              <tr>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Titel</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Datum</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={order.id} className={i % 2 === 0 ? '' : 'bg-[#F8FBF9]'}>
                  <td className="px-6 py-4 font-medium text-[#1A2E1E]">{order.title}</td>
                  <td className="px-6 py-4 text-[#8FAF97]">
                    {new Date(order.created_at).toLocaleDateString('sv-SE')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] ?? ''}`}>
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-6 py-8 text-[#8FAF97] text-center">Inga arbetsorder ännu</p>
        )}
      </div>
    </div>
  )
}
