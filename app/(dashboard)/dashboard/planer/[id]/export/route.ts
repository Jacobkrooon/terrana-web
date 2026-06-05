import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const CUTTING_CLASS_LABEL: Record<string, string> = {
  K1: 'Kalmark', R1: 'Röjningsskog',
  G1: 'Gallring tidig', G2: 'Gallring sen',
  S1: 'Slutavv. tidig', S2: 'Slutavv. sen', S3: 'Slutavv. gammal',
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: plan } = await supabase
    .from('forest_plans')
    .select('id, name, valid_from, valid_to, area:areas(name)')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single()

  if (!plan) return new NextResponse('Not found', { status: 404 })

  const { data: stands } = await supabase
    .from('stands')
    .select('stand_number, area_ha, tree_species, age_years, volume_m3_per_ha, cutting_class, description')
    .eq('plan_id', params.id)
    .order('stand_number')

  const areaName = (plan.area as any)?.name ?? '–'
  const totalHa = stands?.reduce((s, st) => s + (st.area_ha ?? 0), 0) ?? 0
  const totalVol = stands?.reduce((s, st) => s + ((st.volume_m3_per_ha ?? 0) * (st.area_ha ?? 0)), 0) ?? 0

  // Bygger HTML som skrivs ut som PDF via webbläsaren
  const html = `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>${plan.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; font-size: 11pt; color: #1A2E1E; padding: 40px; }
  .header { border-bottom: 2px solid #1B4332; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
  .title { font-size: 20pt; font-weight: bold; color: #1B4332; }
  .subtitle { font-size: 10pt; color: #5A7263; margin-top: 4px; }
  .meta { text-align: right; font-size: 9pt; color: #8FAF97; }
  .summary { display: flex; gap: 32px; margin-bottom: 24px; }
  .summary-item { }
  .summary-label { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5px; color: #8FAF97; }
  .summary-value { font-size: 16pt; font-weight: bold; color: #1B4332; }
  table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  th { background: #F0F7F3; text-align: left; padding: 8px 12px; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5px; color: #5A7263; border-bottom: 1px solid #C8DDD0; }
  td { padding: 7px 12px; border-bottom: 1px solid #EDF7F2; vertical-align: top; }
  tr:nth-child(even) td { background: #F8FBF9; }
  .avd { font-weight: bold; color: #1B4332; }
  .cc { display: inline-block; background: #EAF4EE; color: #1B4332; padding: 1px 6px; border-radius: 4px; font-size: 8pt; font-weight: bold; }
  .footer { margin-top: 32px; border-top: 1px solid #C8DDD0; padding-top: 12px; font-size: 8pt; color: #8FAF97; display: flex; justify-content: space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="title">${plan.name}</div>
    <div class="subtitle">Område: ${areaName}${plan.valid_from ? ` · Giltig ${plan.valid_from.slice(0,4)}–${(plan.valid_to ?? '').slice(0,4)}` : ''}</div>
  </div>
  <div class="meta">Terrana<br>Exporterad ${new Date().toLocaleDateString('sv-SE')}</div>
</div>

<div class="summary">
  <div class="summary-item">
    <div class="summary-label">Avdelningar</div>
    <div class="summary-value">${stands?.length ?? 0}</div>
  </div>
  <div class="summary-item">
    <div class="summary-label">Total areal</div>
    <div class="summary-value">${totalHa.toFixed(1)} ha</div>
  </div>
  <div class="summary-item">
    <div class="summary-label">Total volym</div>
    <div class="summary-value">${Math.round(totalVol)} m³sk</div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Avd.</th>
      <th>Areal (ha)</th>
      <th>Trädslag</th>
      <th>Ålder</th>
      <th>m³sk/ha</th>
      <th>Huggningsklass</th>
      <th>Beskrivning</th>
    </tr>
  </thead>
  <tbody>
    ${(stands ?? []).map(s => `
    <tr>
      <td class="avd">${s.stand_number}</td>
      <td>${s.area_ha?.toFixed(2) ?? '–'}</td>
      <td>${s.tree_species ?? '–'}</td>
      <td>${s.age_years ?? '–'}</td>
      <td>${s.volume_m3_per_ha ?? '–'}</td>
      <td>${s.cutting_class ? `<span class="cc">${s.cutting_class}</span> ${CUTTING_CLASS_LABEL[s.cutting_class] ?? ''}` : '–'}</td>
      <td>${s.description ?? ''}</td>
    </tr>`).join('')}
  </tbody>
</table>

<div class="footer">
  <span>${plan.name} · ${areaName}</span>
  <span>Genererad av Terrana · ${new Date().toLocaleDateString('sv-SE')}</span>
</div>

<script>window.onload = () => window.print()</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
