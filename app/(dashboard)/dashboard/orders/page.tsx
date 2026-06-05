import { createClient } from '@/lib/supabase/server'
import NewOrderButton from './NewOrderButton'
import OrderActions from './OrderActions'

const STATUS_LABEL: Record<string, string> = {
  skickad: 'Skickad', pagaende: 'Pågående', klar: 'Klar',
}
const STATUS_COLOR: Record<string, string> = {
  skickad: 'bg-blue-100 text-blue-700',
  pagaende: 'bg-yellow-100 text-yellow-700',
  klar: 'bg-green-100 text-green-700',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: orders }, { data: contacts }, { data: areas }] = await Promise.all([
    supabase
      .from('work_orders')
      .select(`id, title, description, status, created_at, sender_id, estimated_cost, actual_cost,
        area:areas(name),
        recipient:profiles!work_orders_recipient_id_fkey(full_name)`)
      .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
      .order('created_at', { ascending: false }),
    supabase
      .from('contacts')
      .select('contact_id, contact:profiles!contacts_contact_id_fkey(id, full_name)')
      .eq('owner_id', user!.id),
    supabase
      .from('areas')
      .select('id, name')
      .eq('owner_id', user!.id)
      .order('name'),
  ])

  const rojare = (contacts ?? [])
    .map((c: any) => c.contact)
    .filter(Boolean)
    .map((p: any) => ({ id: p.id, full_name: p.full_name }))

  const active = orders?.filter(o => o.status !== 'klar').length ?? 0
  const done = orders?.filter(o => o.status === 'klar').length ?? 0

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B4332]">Arbetsorder</h1>
          <span className="text-sm text-[#8FAF97]">{active} aktiva · {done} klara</span>
        </div>
        <NewOrderButton rojare={rojare} areas={areas ?? []} />
      </div>

      <div className="bg-white rounded-2xl border border-[#C8DDD0] overflow-hidden">
        {orders && orders.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-[#F8FBF9]">
              <tr>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Titel</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Område</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Mottagare</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Status</th>
                <th className="text-left px-6 py-3 text-[#8FAF97] font-semibold">Datum</th>
                <th className="text-right px-6 py-3 text-[#8FAF97] font-semibold">Kostnad</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} className={i % 2 === 0 ? '' : 'bg-[#F8FBF9]'}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1A2E1E]">{order.title}</p>
                    {order.description && (
                      <p className="text-[#8FAF97] text-xs mt-0.5 line-clamp-1">{order.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#5A7263]">{(order.area as any)?.name ?? '–'}</td>
                  <td className="px-6 py-4 text-[#5A7263]">{(order.recipient as any)?.full_name ?? '–'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[order.status] ?? ''}`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#8FAF97]">
                    {new Date(order.created_at).toLocaleDateString('sv-SE')}
                  </td>
                  <td className="px-6 py-4 text-right text-[#5A7263]">
                    {(order as any).actual_cost != null
                      ? `${Number((order as any).actual_cost).toLocaleString('sv-SE')} kr`
                      : (order as any).estimated_cost != null
                      ? <span className="text-[#8FAF97]">~{Number((order as any).estimated_cost).toLocaleString('sv-SE')} kr</span>
                      : '–'}
                  </td>
                  <td className="px-6 py-4">
                    <OrderActions
                      orderId={order.id}
                      status={order.status}
                      isSender={order.sender_id === user!.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-[#1A2E1E]">Inga arbetsorder</p>
            <p className="text-sm text-[#8FAF97] mt-1">
              {rojare.length > 0 ? 'Klicka "Ny arbetsorder" för att komma igång' : 'Lägg till röjare i iOS-appen för att skapa arbetsorder'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
