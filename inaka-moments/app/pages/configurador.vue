<template>
  <main class="bg-inaka-cream">
    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-inaka-nude bg-white py-12 sm:py-16">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-inaka-mauve/10 blur-3xl" />
        <div class="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-inaka-gold/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-inaka-gold">Tú eliges, nosotros creamos</p>
        <h1 class="text-3xl font-bold text-inaka-terra sm:text-4xl lg:text-5xl">Configura tu presupuesto</h1>
        <p class="mx-auto mt-3 max-w-2xl text-inaka-terra/65">
          Combina los productos que quieras y ve el precio estimado al instante. Sin compromiso: al final te preparamos una propuesta a medida.
        </p>
      </div>
    </section>

    <!-- Barra de pasos -->
    <section class="sticky top-[73px] z-30 border-b border-inaka-nude bg-inaka-cream/95 backdrop-blur-sm">
      <div class="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <ol class="flex items-center justify-between gap-1 sm:gap-2">
          <li v-for="s in steps" :key="s.n" class="flex flex-1 items-center gap-2">
            <button
              type="button"
              class="flex items-center gap-2 rounded-full transition-colors"
              :class="s.n <= maxReachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'"
              :disabled="s.n > maxReachable"
              @click="s.n <= maxReachable && (step = s.n)"
            >
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all"
                :class="s.n === step
                  ? 'bg-inaka-terra text-inaka-cream ring-2 ring-inaka-terra/20'
                  : s.n < step ? 'bg-inaka-gold text-inaka-terra' : 'bg-inaka-nude text-inaka-terra/50'"
              >
                <svg v-if="s.n < step" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <template v-else>{{ s.n }}</template>
              </span>
              <span class="hidden text-sm font-medium sm:inline" :class="s.n === step ? 'text-inaka-terra' : 'text-inaka-terra/50'">{{ s.label }}</span>
            </button>
            <span v-if="s.n < steps.length" class="h-px flex-1 bg-inaka-nude" aria-hidden="true" />
          </li>
        </ol>
      </div>
    </section>

    <!-- Confirmación -->
    <section v-if="done" class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-inaka-nude sm:p-12">
        <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-inaka-gold/15">
          <svg class="h-10 w-10 text-inaka-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 class="text-2xl font-bold text-inaka-terra sm:text-3xl">¡Propuesta enviada!</h2>
        <p class="mx-auto mt-3 max-w-md text-inaka-terra/65">
          Hemos recibido tu configuración. Te enviaremos la confirmación a
          <strong class="text-inaka-terra">{{ contact.email }}</strong> y te contactaremos en menos de 24 h para cerrar los detalles.
        </p>

        <!-- Resumen autoritativo del servidor -->
        <div v-if="result" class="mx-auto mt-8 max-w-md rounded-2xl bg-inaka-cream p-5 text-left ring-1 ring-inaka-nude">
          <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-inaka-gold">Resumen de tu propuesta</p>
          <ul class="flex flex-col divide-y divide-inaka-nude/70">
            <li v-for="(l, i) in result.lines" :key="i" class="flex items-center justify-between gap-3 py-2 text-sm">
              <span class="min-w-0 flex-1 truncate text-inaka-terra/80">{{ l.label }} <span class="text-inaka-terra/40">× {{ l.qty }}</span></span>
              <span class="shrink-0 font-semibold text-inaka-terra">
                <template v-if="l.consulta">A consultar</template>
                <template v-else>{{ formatEUR(l.line_total!) }}</template>
              </span>
            </li>
            <li v-for="adj in result.adjustments" :key="adj.key" class="flex items-center justify-between gap-3 py-2 text-sm">
              <span class="text-inaka-terra/60">{{ adj.label }}</span>
              <span class="font-medium text-inaka-terra/80">
                <template v-if="adj.amount == null">{{ adj.note ?? 'a consultar' }}</template>
                <template v-else>+ {{ formatEUR(adj.amount) }}</template>
              </span>
            </li>
          </ul>
          <div class="mt-3 flex items-center justify-between border-t border-inaka-nude pt-3">
            <span class="font-bold text-inaka-terra">Total estimado</span>
            <span class="text-xl font-extrabold text-inaka-terra">{{ formatEUR(result.total) }}<span v-if="result.hasConsulta" class="align-super text-sm">*</span></span>
          </div>
          <p class="mt-3 text-xs leading-snug text-inaka-terra/50">
            Presupuesto orientativo y sujeto a confirmación de disponibilidad. Montaje incluido; la señal se abona al agendar.
          </p>
        </div>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            class="rounded-xl bg-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-cream transition-opacity hover:opacity-90"
            @click="startOver"
          >
            Crear otro presupuesto
          </button>
          <NuxtLink to="/catalogo" class="rounded-xl border border-inaka-terra px-6 py-3 text-sm font-semibold text-inaka-terra transition-colors hover:bg-inaka-nude">
            Volver al catálogo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Flujo -->
    <section v-else class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Columna principal -->
        <div class="lg:col-span-2">
          <Transition name="fade" mode="out-in">

            <!-- PASO 1: Ocasión -->
            <div v-if="step === 1" key="s1">
              <h2 class="text-2xl font-bold text-inaka-terra">¿Qué celebras?</h2>
              <p class="mb-6 mt-1 text-sm text-inaka-terra/55">Elige la ocasión para personalizar tu presupuesto.</p>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <button
                  v-for="opt in eventoOptions"
                  :key="opt.value"
                  type="button"
                  class="group flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-200"
                  :class="state.event_type === opt.value ? 'border-inaka-terra bg-inaka-terra/5 shadow-sm' : 'border-inaka-beige bg-white hover:border-inaka-terra/50 hover:bg-inaka-nude/20'"
                  @click="selectOccasion(opt.value)"
                >
                  <span class="text-3xl transition-transform duration-200 group-hover:scale-110" aria-hidden="true">{{ opt.icon }}</span>
                  <span class="text-sm font-semibold text-inaka-terra">{{ opt.label }}</span>
                </button>
              </div>
            </div>

            <!-- PASO 2: Fecha -->
            <div v-else-if="step === 2" key="s2">
              <h2 class="text-2xl font-bold text-inaka-terra">¿Cuándo será?</h2>
              <p class="mb-6 mt-1 text-sm text-inaka-terra/55">La fecha nos ayuda a comprobar disponibilidad. Puedes ajustarla más adelante.</p>

              <div class="flex max-w-md flex-col gap-5">
                <div class="flex flex-col gap-1.5">
                  <label for="cfg-fecha" class="text-sm font-semibold text-inaka-terra">Fecha aproximada del evento</label>
                  <input
                    id="cfg-fecha"
                    v-model="state.event_date"
                    type="date"
                    :min="minDate"
                    class="rounded-xl border bg-white px-4 py-3 text-sm text-inaka-terra outline-none transition-all"
                    :class="state.event_date ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
                  />
                  <p class="flex items-center gap-1 text-xs text-inaka-terra/50">
                    <svg class="h-3 w-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recuerda agendar con al menos {{ rules.antelacion_dias }} días de antelación.
                  </p>
                </div>

                <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-inaka-beige bg-white p-4 transition-colors hover:border-inaka-terra/40">
                  <input v-model="state.far" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-inaka-terra" />
                  <span class="text-sm text-inaka-terra/75">
                    <span class="font-semibold text-inaka-terra">Mi evento es a más de {{ rules.km_incluidos }} km de Abrera.</span>
                    <span class="mt-0.5 block text-xs text-inaka-terra/50">Se añadiría un pequeño plus de desplazamiento (a consultar según distancia).</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- PASO 3: Productos -->
            <div v-else-if="step === 3" key="s3">
              <h2 class="text-2xl font-bold text-inaka-terra">Elige tus productos</h2>
              <p class="mb-5 mt-1 text-sm text-inaka-terra/55">Añade lo que quieras y ajusta cantidades. Todo es combinable entre sí.</p>

              <div v-if="productsPending" class="py-16 text-center text-inaka-terra/50">Cargando catálogo…</div>

              <template v-else>
                <!-- Packs recomendados -->
                <div v-if="packsForOccasion.length" class="mb-8">
                  <h3 class="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-inaka-gold">
                    <span aria-hidden="true">✨</span> Packs recomendados
                  </h3>
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div
                      v-for="pk in packsForOccasion"
                      :key="pk.id"
                      class="flex flex-col gap-2 rounded-2xl border-2 border-inaka-gold/40 bg-inaka-gold/5 p-4"
                    >
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <p class="font-bold text-inaka-terra">{{ pk.name }}</p>
                          <p class="text-sm font-semibold text-inaka-terra/70">{{ pk.price != null ? formatEUR(pk.price) : 'A consultar' }}</p>
                        </div>
                        <span v-if="countOf('pack', pk.id)" class="rounded-full bg-inaka-terra px-2 py-0.5 text-xs font-bold text-inaka-cream">× {{ countOf('pack', pk.id) }}</span>
                      </div>
                      <p class="line-clamp-2 text-xs text-inaka-terra/55">{{ pk.description }}</p>
                      <button
                        type="button"
                        class="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-inaka-terra px-4 py-2 text-xs font-semibold text-inaka-cream transition-opacity hover:opacity-90"
                        @click="addPack(pk)"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                        Añadir pack
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Filtro de categorías -->
                <div class="mb-5 flex flex-wrap gap-2">
                  <button
                    v-for="cat in categorias"
                    :key="cat.value"
                    type="button"
                    class="rounded-full px-4 py-1.5 text-xs font-medium transition-all"
                    :class="categoriaActiva === cat.value ? 'bg-inaka-terra text-inaka-cream' : 'bg-inaka-nude/60 text-inaka-terra/70 hover:bg-inaka-nude'"
                    @click="categoriaActiva = cat.value"
                  >
                    {{ cat.label }}
                  </button>
                </div>

                <!-- Grid de productos -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    v-for="p in productosFiltrados"
                    :key="p.id"
                    class="flex flex-col gap-3 rounded-2xl border border-inaka-nude bg-white p-4 transition-shadow hover:shadow-sm"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-inaka-nude/40">
                        <NuxtImg v-if="productImage(p)" :src="productImage(p)!" :alt="p.name" loading="lazy" width="56" height="56" class="h-full w-full object-cover" />
                        <span v-else class="text-2xl opacity-70" aria-hidden="true">{{ categoryEmoji(p.category) }}</span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-bold leading-snug text-inaka-terra">{{ p.name }}</p>
                        <p class="text-sm font-semibold text-inaka-terra/70">{{ productPriceLabel(p) }}</p>
                        <span v-if="countOf('product', p.id)" class="mt-1 inline-block rounded-full bg-inaka-gold/20 px-2 py-0.5 text-[11px] font-bold text-inaka-terra">En tu presupuesto: {{ countOf('product', p.id) }}</span>
                      </div>
                    </div>

                    <!-- Selectores de variante -->
                    <div class="flex flex-wrap gap-2">
                      <select
                        v-if="productTiers(p).length"
                        v-model="draftFor(p).tier"
                        class="min-w-0 flex-1 rounded-lg border border-inaka-beige bg-inaka-cream px-3 py-2 text-xs text-inaka-terra outline-none focus:border-inaka-terra"
                        :aria-label="`Opción de precio de ${p.name}`"
                      >
                        <option v-for="t in productTiers(p)" :key="t.label" :value="t.label">{{ t.label }} — {{ formatEUR(t.price) }}</option>
                      </select>
                      <select
                        v-if="productSizes(p).length"
                        v-model="draftFor(p).size"
                        class="min-w-0 flex-1 rounded-lg border border-inaka-beige bg-inaka-cream px-3 py-2 text-xs text-inaka-terra outline-none focus:border-inaka-terra"
                        :aria-label="`Tamaño de ${p.name}`"
                      >
                        <option value="">Tamaño…</option>
                        <option v-for="s in productSizes(p)" :key="s" :value="s">{{ s }}</option>
                      </select>
                      <select
                        v-if="productOptions(p).length"
                        v-model="draftFor(p).option"
                        class="min-w-0 flex-1 rounded-lg border border-inaka-beige bg-inaka-cream px-3 py-2 text-xs text-inaka-terra outline-none focus:border-inaka-terra"
                        :aria-label="`Opción de ${p.name}`"
                      >
                        <option value="">Opción…</option>
                        <option v-for="o in productOptions(p)" :key="o" :value="o">{{ o }}</option>
                      </select>
                    </div>

                    <!-- Cantidad + añadir -->
                    <div class="mt-auto flex items-center gap-2">
                      <div class="flex items-center rounded-lg border border-inaka-beige">
                        <button type="button" class="flex h-8 w-8 items-center justify-center text-inaka-terra/70 hover:bg-inaka-nude/50" :aria-label="`Menos ${p.name}`" @click="draftFor(p).qty = Math.max(1, draftFor(p).qty - 1)">
                          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
                        </button>
                        <span class="w-8 text-center text-sm font-semibold text-inaka-terra tabular-nums">{{ draftFor(p).qty }}</span>
                        <button type="button" class="flex h-8 w-8 items-center justify-center text-inaka-terra/70 hover:bg-inaka-nude/50" :aria-label="`Más ${p.name}`" @click="draftFor(p).qty = Math.min(99, draftFor(p).qty + 1)">
                          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all"
                        :class="justAdded === p.id ? 'bg-inaka-gold text-inaka-terra' : 'bg-inaka-terra text-inaka-cream hover:opacity-90'"
                        @click="addProduct(p)"
                      >
                        <svg v-if="justAdded === p.id" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                        {{ justAdded === p.id ? 'Añadido' : 'Añadir' }}
                      </button>
                    </div>
                  </div>
                </div>

                <p v-if="productosFiltrados.length === 0" class="py-10 text-center text-sm text-inaka-terra/50">No hay productos en esta categoría.</p>
              </template>
            </div>

            <!-- PASO 4: Contacto -->
            <div v-else-if="step === 4" key="s4">
              <h2 class="text-2xl font-bold text-inaka-terra">Tus datos</h2>
              <p class="mb-6 mt-1 text-sm text-inaka-terra/55">Te enviaremos la propuesta y te contactaremos para confirmar. Campos con <span class="font-bold text-inaka-mauve">*</span> obligatorios.</p>

              <div class="flex max-w-md flex-col gap-5">
                <!-- Desmontaje -->
                <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-inaka-beige bg-white p-4 transition-colors hover:border-inaka-terra/40">
                  <input v-model="state.desmontaje" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-inaka-terra" />
                  <span class="text-sm text-inaka-terra/75">
                    <span class="font-semibold text-inaka-terra">Quiero servicio de desmontaje (+{{ formatEUR(rules.desmontaje_precio) }}).</span>
                    <span class="mt-0.5 block text-xs text-inaka-terra/50">El montaje siempre va incluido; el desmontaje es opcional.</span>
                  </span>
                </label>

                <div class="flex flex-col gap-1.5">
                  <label for="cfg-nombre" class="text-sm font-semibold text-inaka-terra">Nombre completo <span class="text-inaka-mauve">*</span></label>
                  <input id="cfg-nombre" v-model="contact.nombre" type="text" autocomplete="name" placeholder="María García López"
                    class="rounded-xl border bg-white px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-all"
                    :class="touched.nombre && !contact.nombre.trim() ? 'border-red-300 ring-1 ring-red-200' : contact.nombre ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
                    @blur="touched.nombre = true" />
                  <p v-if="touched.nombre && !contact.nombre.trim()" class="text-xs text-red-500">Este campo es obligatorio.</p>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="cfg-email" class="text-sm font-semibold text-inaka-terra">Correo electrónico <span class="text-inaka-mauve">*</span></label>
                  <input id="cfg-email" v-model="contact.email" type="email" autocomplete="email" placeholder="maria@ejemplo.com"
                    class="rounded-xl border bg-white px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-all"
                    :class="touched.email && !emailValido ? 'border-red-300 ring-1 ring-red-200' : contact.email && emailValido ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus:border-inaka-terra'"
                    @blur="touched.email = true" />
                  <p v-if="touched.email && !emailValido" class="text-xs text-red-500">Introduce un correo válido.</p>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="cfg-tel" class="text-sm font-semibold text-inaka-terra">WhatsApp / Teléfono <span class="text-inaka-mauve">*</span></label>
                  <div class="flex overflow-hidden rounded-xl border transition-all"
                    :class="touched.telefono && !telefonoValido ? 'border-red-300 ring-1 ring-red-200' : phoneNumero && telefonoValido ? 'border-inaka-terra ring-1 ring-inaka-terra/20' : 'border-inaka-beige focus-within:border-inaka-terra'">
                    <div class="relative shrink-0">
                      <select v-model="phonePrefijo" class="h-full cursor-pointer appearance-none border-r border-inaka-beige bg-inaka-nude/60 pl-3 pr-7 text-sm font-medium text-inaka-terra outline-none" aria-label="Prefijo de país">
                        <option v-for="pfx in prefijos" :key="pfx.code" :value="pfx.dial">{{ pfx.flag }} {{ pfx.dial }}</option>
                      </select>
                      <svg class="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-inaka-terra/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <input id="cfg-tel" v-model="phoneNumero" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="600 000 000"
                      class="flex-1 bg-white px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none" @blur="touched.telefono = true" />
                  </div>
                  <p v-if="touched.telefono && !telefonoValido" class="text-xs text-red-500">Introduce un número válido.</p>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="cfg-msg" class="text-sm font-semibold text-inaka-terra">Peticiones especiales <span class="ml-1 text-xs font-normal text-inaka-terra/40">(opcional)</span></label>
                  <textarea id="cfg-msg" v-model="contact.mensaje" rows="3" placeholder="Colores, temática, alguna idea concreta…"
                    class="resize-none rounded-xl border border-inaka-beige bg-white px-4 py-3 text-sm text-inaka-terra placeholder:text-inaka-terra/30 outline-none transition-all focus:border-inaka-terra" />
                </div>

                <!-- Honeypot -->
                <div class="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label for="cfg-website">No rellenes este campo</label>
                  <input id="cfg-website" v-model="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" />
                </div>

                <!-- RGPD -->
                <label class="flex cursor-pointer select-none items-start gap-3">
                  <input v-model="consent" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 accent-inaka-terra" />
                  <span class="text-xs leading-relaxed text-inaka-terra/70">
                    He leído y acepto la
                    <NuxtLink to="/politica-privacidad" target="_blank" class="font-semibold text-inaka-gold hover:underline">política de privacidad</NuxtLink>
                    y consiento el tratamiento de mis datos para gestionar esta solicitud. <span class="font-bold text-inaka-mauve">*</span>
                  </span>
                </label>

                <ClientOnly>
                  <NuxtTurnstile v-model="turnstileToken" />
                </ClientOnly>

                <div v-if="submitError" class="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p class="text-sm text-red-700">{{ submitError }}</p>
                </div>
              </div>
            </div>

          </Transition>

          <!-- Navegación -->
          <div class="mt-8 flex items-center justify-between gap-3">
            <button
              v-if="step > 1"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-inaka-beige px-5 py-3 text-sm font-semibold text-inaka-terra/70 transition-colors hover:bg-inaka-nude/50"
              @click="step--"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Atrás
            </button>
            <span v-else />

            <button
              v-if="step < 4"
              type="button"
              :disabled="!canAdvance"
              class="inline-flex items-center gap-2 rounded-xl bg-inaka-terra px-7 py-3 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
              @click="goNext"
            >
              {{ step === 3 ? 'Ir a mis datos' : 'Siguiente' }}
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <button
              v-else
              type="button"
              :disabled="!canSubmit || isSending"
              class="inline-flex items-center gap-2 rounded-xl bg-inaka-terra px-7 py-3.5 text-sm font-semibold text-inaka-cream shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
              @click="submit"
            >
              <svg v-if="isSending" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              {{ isSending ? 'Enviando…' : 'Enviar propuesta' }}
            </button>
          </div>
        </div>

        <!-- Sidebar de presupuesto (desktop) -->
        <aside class="hidden lg:block">
          <div class="sticky top-40 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-inaka-nude">
            <ConfiguratorSummary />
          </div>
        </aside>
      </div>
    </section>

    <!-- Barra inferior de presupuesto (móvil/tablet) -->
    <div v-if="!done" class="fixed inset-x-0 bottom-0 z-40 border-t border-inaka-nude bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:hidden">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-xl bg-inaka-cream px-4 py-3"
        @click="sheetOpen = true"
      >
        <span class="flex items-center gap-2 text-sm font-semibold text-inaka-terra">
          <span class="flex h-6 min-w-6 items-center justify-center rounded-full bg-inaka-terra px-1.5 text-xs font-bold text-inaka-cream">{{ totalQty }}</span>
          Ver presupuesto
        </span>
        <span class="text-lg font-extrabold text-inaka-terra">{{ formatEUR(quote.total) }}<span v-if="quote.hasConsulta" class="align-super text-xs">*</span></span>
      </button>
    </div>

    <!-- Hoja inferior (móvil) -->
    <Transition name="sheet">
      <div v-if="sheetOpen && !done" class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-inaka-terra/30 backdrop-blur-sm" @click="sheetOpen = false" />
        <div class="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white">
          <div class="sticky top-0 flex items-center justify-between border-b border-inaka-nude bg-white px-5 py-3">
            <span class="text-sm font-bold text-inaka-terra">Tu presupuesto</span>
            <button type="button" class="flex h-8 w-8 items-center justify-center rounded-full text-inaka-terra/60 hover:bg-inaka-nude" aria-label="Cerrar" @click="sheetOpen = false">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <ConfiguratorSummary />
        </div>
      </div>
    </Transition>

    <!-- Espaciador para que la barra móvil no tape contenido -->
    <div v-if="!done" class="h-20 lg:hidden" aria-hidden="true" />
  </main>
</template>

<script setup lang="ts">
import emailjs from '@emailjs/browser'
import type { Pack, Product } from '~/utils/catalog'

useHead({
  title: 'Configurador de presupuesto — Inaka Moments',
  meta: [
    { name: 'description', content: 'Crea tu presupuesto de decoración con globos a medida: combina arcos, columnas, aros 360º, packs y más, y ve el precio estimado al instante. Abrera y Barcelona.' },
    { property: 'og:title', content: 'Configura tu presupuesto — Inaka Moments' },
    { property: 'og:description', content: 'Tú eliges, nosotros creamos. Combina productos y recibe una propuesta a medida.' },
  ],
})

const config = useRuntimeConfig()
const route = useRoute()

const {
  state, products, packs, productsPending, rules, quote, totalQty,
  addLine, countOf, clear,
} = useConfigurator()

const step = ref(1)
const done = ref(false)
const sheetOpen = ref(false)
const justAdded = ref('')
const isSending = ref(false)
const submitError = ref('')
const result = ref<QuoteResult | null>(null)

interface QuoteResult {
  id: string
  total: number
  itemsSubtotal: number
  hasConsulta: boolean
  detallito: boolean
  hasRental: boolean
  adjustments: { key: string, label: string, amount: number | null, note?: string }[]
  lines: { label: string, qty: number, unit_price: number | null, line_total: number | null, consulta: boolean, is_rental: boolean }[]
}

const steps = [
  { n: 1, label: 'Ocasión' },
  { n: 2, label: 'Fecha' },
  { n: 3, label: 'Productos' },
  { n: 4, label: 'Datos' },
]

// Solo se puede saltar a pasos ya alcanzados
const maxReachable = computed(() => {
  if (!state.value.event_type) return 1
  if (!state.value.event_date) return 2
  if (state.value.lines.length === 0) return 3
  return 4
})

// ── Opciones de ocasión ────────────────────────────────────────────────────
const eventoOptions = [
  { value: 'cumpleanos', label: 'Cumpleaños', icon: '🎂' },
  { value: 'baby_shower', label: 'Baby Shower', icon: '🍼' },
  { value: 'bautizo', label: 'Bautizo', icon: '🕊️' },
  { value: 'comunion', label: 'Comunión', icon: '✨' },
  { value: 'graduacion', label: 'Graduación', icon: '🎓' },
  { value: 'despedida', label: 'Despedida', icon: '🥂' },
  { value: 'jubilacion', label: 'Jubilación', icon: '🌅' },
  { value: 'corporativo', label: 'Corporativo', icon: '🏢' },
  { value: 'otro', label: 'Otro', icon: '💡' },
]

function selectOccasion(value: string) {
  state.value.event_type = value
  step.value = 2
}

// ── Fecha ──────────────────────────────────────────────────────────────────
const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + rules.value.antelacion_dias)
  return d.toISOString().split('T')[0]!
})

// ── Productos ──────────────────────────────────────────────────────────────
const categoriaActiva = ref('todos')

const productosForOccasion = computed(() =>
  products.value.filter(p => productMatchesEventType(p, state.value.event_type)),
)

const packsForOccasion = computed(() =>
  packs.value.filter((pk) => {
    const types = jsonArray<string>(pk.event_types)
    return types.length === 0 || types.includes(state.value.event_type)
  }),
)

const categorias = computed(() => {
  const present = [...new Set(productosForOccasion.value.map(p => p.category))]
  return [{ value: 'todos', label: 'Todos' }, ...present.map(c => ({ value: c, label: CATEGORY_LABELS[c] ?? c }))]
})

const productosFiltrados = computed(() =>
  categoriaActiva.value === 'todos'
    ? productosForOccasion.value
    : productosForOccasion.value.filter(p => p.category === categoriaActiva.value),
)

// Draft por producto (variante seleccionada antes de añadir)
interface Draft { tier: string, size: string, option: string, qty: number }
const drafts = reactive<Record<string, Draft>>({})
function draftFor(p: Product): Draft {
  if (!drafts[p.id]) {
    const tiers = productTiers(p)
    drafts[p.id] = { tier: tiers[0]?.label ?? '', size: '', option: '', qty: 1 }
  }
  return drafts[p.id]!
}

function addProduct(p: Product) {
  const d = draftFor(p)
  addLine({
    kind: 'product',
    id: p.id,
    qty: d.qty,
    tier: d.tier || null,
    size: d.size || null,
    options: d.option ? [d.option] : [],
  })
  d.qty = 1
  justAdded.value = p.id
  setTimeout(() => { if (justAdded.value === p.id) justAdded.value = '' }, 1200)
}

function addPack(pk: Pack) {
  addLine({ kind: 'pack', id: pk.id, qty: 1 })
}

function productImage(p: Product): string | null {
  const imgs = jsonArray(p.images)
  return imgs.length ? storagePublicUrl('catalog-media', imgs[0]!) : null
}

function categoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    estructuras: '🎈', globos: '🎈', led: '💡', baby: '🍼',
    flores: '🌸', extras: '✨', detalles: '🎁', 'mesa-dulce': '🍬',
  }
  return map[cat] ?? '🎈'
}

// ── Contacto ───────────────────────────────────────────────────────────────
const contact = reactive({ nombre: '', email: '', mensaje: '' })
const phonePrefijo = ref('+34')
const phoneNumero = ref('')
const consent = ref(false)
const honeypot = ref('')
const turnstileToken = ref('')
const touched = reactive({ nombre: false, email: false, telefono: false })

const prefijos = [
  { code: 'ES', dial: '+34', flag: '🇪🇸' },
  { code: 'MX', dial: '+52', flag: '🇲🇽' },
  { code: 'AR', dial: '+54', flag: '🇦🇷' },
  { code: 'CO', dial: '+57', flag: '🇨🇴' },
  { code: 'CL', dial: '+56', flag: '🇨🇱' },
  { code: 'PE', dial: '+51', flag: '🇵🇪' },
  { code: 'VE', dial: '+58', flag: '🇻🇪' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', flag: '🇫🇷' },
  { code: 'IT', dial: '+39', flag: '🇮🇹' },
  { code: 'PT', dial: '+351', flag: '🇵🇹' },
]

const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
const telefonoValido = computed(() => phoneNumero.value.replace(/\s/g, '').length >= 7)
const canSubmit = computed(() => contact.nombre.trim() !== '' && emailValido.value && telefonoValido.value && consent.value)

// ── Navegación ─────────────────────────────────────────────────────────────
const canAdvance = computed(() => {
  if (step.value === 1) return !!state.value.event_type
  if (step.value === 2) return !!state.value.event_date
  if (step.value === 3) return state.value.lines.length > 0
  return true
})

function goNext() {
  if (!canAdvance.value) return
  if (step.value < 4) step.value++
}

// ── Envío ──────────────────────────────────────────────────────────────────
async function submit() {
  touched.nombre = true
  touched.email = true
  touched.telefono = true
  if (!canSubmit.value) {
    submitError.value = !consent.value
      ? 'Debes aceptar la política de privacidad para continuar.'
      : 'Revisa tus datos de contacto.'
    return
  }
  if (state.value.lines.length === 0) {
    submitError.value = 'Añade al menos un producto a tu presupuesto.'
    step.value = 3
    return
  }

  isSending.value = true
  submitError.value = ''
  const fullPhone = `${phonePrefijo.value} ${phoneNumero.value}`.trim()

  try {
    const res = await $fetch<{ ok: boolean, notified: boolean, quote: QuoteResult | null }>('/api/quotes', {
      method: 'POST',
      body: {
        event_type: state.value.event_type,
        event_date: state.value.event_date,
        far: state.value.far,
        desmontaje: state.value.desmontaje,
        lines: state.value.lines,
        nombre: contact.nombre,
        email: contact.email,
        telefono: fullPhone,
        mensaje: contact.mensaje,
        consent: consent.value,
        website: honeypot.value,
        turnstileToken: turnstileToken.value,
        source: 'configurador',
        utm: utm.value,
      },
    })

    result.value = res.quote
    if (!res.notified) await notifyViaEmailJs(fullPhone, res.quote)
    done.value = true
    sheetOpen.value = false
    clear()
    if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (err: any) {
    console.error('Quote submit error:', err)
    submitError.value = err?.data?.message
      ?? 'Ha ocurrido un error al enviar tu propuesta. Inténtalo de nuevo o contáctanos por WhatsApp.'
  }
  finally {
    isSending.value = false
  }
}

const utm = computed(() => {
  const out: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const v = route.query[k]
    if (typeof v === 'string' && v) out[k] = v
  }
  return out
})

/** Fallback EmailJS (solo si el servidor no pudo avisar a la dueña). */
async function notifyViaEmailJs(fullPhone: string, q: QuoteResult | null) {
  if (!config.public.emailjsServiceId) return
  const labels = Object.fromEntries(eventoOptions.map(o => [o.value, o.label]))
  const resumen = q
    ? q.lines.map(l => `${l.label} × ${l.qty}${l.consulta ? ' (a consultar)' : ` — ${formatEUR(l.line_total!)}`}`).join('\n')
      + `\n\nTOTAL ESTIMADO: ${formatEUR(q.total)}${q.hasConsulta ? ' (orientativo)' : ''}`
    : 'Ver detalle en el panel.'
  try {
    await emailjs.send(
      config.public.emailjsServiceId,
      config.public.emailjsTemplateId,
      {
        nombre: contact.nombre,
        email: contact.email,
        telefono: fullPhone,
        tipo_evento: labels[state.value.event_type] ?? state.value.event_type,
        fecha: state.value.event_date || 'No especificada',
        invitados: 'Configurador',
        espacios: 'Configurador de presupuesto',
        estilo: 'No especificado',
        ideas_extra: `${contact.mensaje ? contact.mensaje + '\n\n' : ''}${resumen}`,
        to_email: config.public.emailjsRecipient,
        reply_to: contact.email,
      },
      config.public.emailjsPublicKey,
    )
  }
  catch (err) {
    console.error('EmailJS fallback error:', err)
  }
}

function startOver() {
  clear()
  result.value = null
  done.value = false
  step.value = 1
  contact.nombre = ''
  contact.email = ''
  contact.mensaje = ''
  phoneNumero.value = ''
  phonePrefijo.value = '+34'
  consent.value = false
  honeypot.value = ''
  turnstileToken.value = ''
  touched.nombre = false
  touched.email = false
  touched.telefono = false
  submitError.value = ''
}

// ── Prefill por query (?ocasion=slug&add=slug) ─────────────────────────────
onMounted(() => {
  const ocasion = route.query.ocasion
  if (typeof ocasion === 'string' && eventoOptions.some(o => o.value === ocasion) && !state.value.event_type) {
    state.value.event_type = ocasion
    if (step.value === 1) step.value = 2
  }

  const add = route.query.add
  if (typeof add === 'string' && add) {
    const p = products.value.find(pr => pr.slug === add)
    if (p) {
      if (!state.value.event_type) {
        const firstType = productEventTypes(p)[0]
        state.value.event_type = firstType ?? 'otro'
      }
      addLine({ kind: 'product', id: p.id, qty: 1, tier: productTiers(p)[0]?.label ?? null, size: null, options: [] })
      if (state.value.event_date) step.value = 3
      else step.value = 2
    }
  }

  const addPack = route.query.addPack
  if (typeof addPack === 'string' && addPack) {
    const pk = packs.value.find(p => p.slug === addPack)
    if (pk) {
      if (!state.value.event_type) {
        const firstType = jsonArray<string>(pk.event_types)[0]
        state.value.event_type = firstType ?? 'otro'
      }
      addLine({ kind: 'pack', id: pk.id, qty: 1 })
      if (state.value.event_date) step.value = 3
      else step.value = 2
    }
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active > div:last-child,
.sheet-leave-active > div:last-child {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from > div:last-child,
.sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
