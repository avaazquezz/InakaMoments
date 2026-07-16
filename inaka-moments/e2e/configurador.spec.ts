import { expect, test } from '@playwright/test'

// ponytail: escribe y autolimpia un lead/quote real en la Supabase de
// producción (no hay proyecto de staging) — mover a un proyecto de staging
// si el volumen de ejecuciones de CI crece. Por eso corre en un workflow
// manual (workflow_dispatch), no en cada push.

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

function supabaseHeaders() {
  return {
    apikey: SUPABASE_SERVICE_KEY!,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }
}

test('camino crítico: configurador → presupuesto enviado y persistido', async ({ page }) => {
  test.skip(!SUPABASE_URL || !SUPABASE_SERVICE_KEY, 'Requiere SUPABASE_URL y SUPABASE_SERVICE_KEY para verificar/limpiar el resultado.')

  const testEmail = `e2e-${Date.now()}@inakamoments-e2e.test`

  await page.goto('/configurador', { waitUntil: 'networkidle' })

  // Paso 1 — Ocasión (avanza solo al paso 2 al elegir). El botón ya es
  // "actionable" para Playwright antes de que Vue termine de hidratar la
  // página SSR — un primer click puede no disparar @click todavía. Se
  // reintenta hasta que el paso 2 aparece de verdad.
  await expect(async () => {
    await page.getByRole('button', { name: 'Cumpleaños' }).click()
    await expect(page.getByText('¿Cuándo será?')).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 15_000 })

  // Paso 2 — Fecha: el primer día habilitado ya respeta la antelación mínima
  await page.locator('[role="gridcell"]:not([disabled])').first().click()
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()

  // Paso 3 — Productos: el primer "Añadir" del catálogo real
  await page.getByRole('button', { name: 'Añadir', exact: true }).first().click()
  await page.getByRole('button', { name: 'Ir a mis datos' }).click()

  // Paso 4 — Datos de contacto
  await page.getByPlaceholder('María García López').fill('E2E Test')
  await page.getByPlaceholder('maria@ejemplo.com').fill(testEmail)
  await page.getByPlaceholder('600 000 000').fill('600000000')
  await page.getByLabel(/He leído y acepto/).check()

  // El widget de Turnstile (clave de test, siempre pasa) tarda un instante
  // en generar el token tras montarse.
  await page.waitForTimeout(1500)

  await page.getByRole('button', { name: 'Enviar propuesta' }).click()

  await expect(page.getByRole('heading', { name: '¡Propuesta enviada!' })).toBeVisible({ timeout: 15_000 })

  // Verificación autoritativa: el lead/quote existen de verdad en Supabase.
  const leadRes = await page.request.get(
    `${SUPABASE_URL}/rest/v1/leads?email=eq.${encodeURIComponent(testEmail)}&select=id`,
    { headers: supabaseHeaders() },
  )
  const leads = await leadRes.json() as { id: string }[]
  expect(leads).toHaveLength(1)
  const leadId = leads[0]!.id

  const quoteRes = await page.request.get(
    `${SUPABASE_URL}/rest/v1/quotes?lead_id=eq.${leadId}&select=id`,
    { headers: supabaseHeaders() },
  )
  const quotes = await quoteRes.json() as { id: string }[]
  expect(quotes).toHaveLength(1)
  const quoteId = quotes[0]!.id

  // Autolimpieza (orden por FKs): quote_items → quotes → leads.
  await page.request.delete(`${SUPABASE_URL}/rest/v1/quote_items?quote_id=eq.${quoteId}`, { headers: supabaseHeaders() })
  await page.request.delete(`${SUPABASE_URL}/rest/v1/quotes?id=eq.${quoteId}`, { headers: supabaseHeaders() })
  await page.request.delete(`${SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, { headers: supabaseHeaders() })
})
