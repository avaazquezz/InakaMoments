<template>
  <section class="flex min-h-screen items-center">
    <div class="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

        <!-- Text column (contenido editable desde el panel: site_content.hero) -->
        <div class="order-2 flex flex-col gap-6 lg:order-1">
          <p class="text-sm font-semibold uppercase tracking-widest text-inaka-gold">
            {{ hero.tagline }}
          </p>

          <h1 class="font-display text-4xl font-bold leading-tight text-inaka-terra sm:text-5xl lg:text-6xl">
            {{ hero.titulo }}<br class="hidden sm:block" />
            <span class="text-inaka-mauve">{{ hero.titulo_span }}</span>
          </h1>

          <p class="max-w-prose text-base leading-relaxed text-inaka-terra/80 sm:text-lg">
            {{ hero.subtitulo }}
          </p>

          <!-- CTA buttons -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <BaseButtonLink to="/configurador" :icon="undefined">{{ hero.cta_principal }}</BaseButtonLink>

            <a
              :href="catalogPdfUrl"
              target="_blank"
              rel="noopener"
              class="rounded-md border border-inaka-terra px-6 py-3 text-center text-sm font-semibold text-inaka-terra outline-none transition-colors hover:bg-inaka-nude focus-visible:ring-2 focus-visible:ring-inaka-gold"
            >
              {{ hero.cta_secundario }}
            </a>
          </div>
        </div>

        <!-- Logo column: el canvas vive aquí como hermano del img,
             posicionado absolute respecto a este div que es relative -->
        <div
          ref="logoCol"
          class="order-1 relative flex items-center justify-center lg:order-2"
        >
          <NuxtImg
            src="/logo.png"
            alt="Inaka Moments — Momentos bonitos, recuerdos para siempre"
            class="relative z-10 w-72 cursor-pointer select-none transition-transform duration-300 motion-safe:hover:scale-105 sm:w-96 lg:w-[460px]"
            width="460"
            height="460"
            format="webp"
            quality="85"
            sizes="288px sm:384px lg:460px"
            loading="eager"
            fetchpriority="high"
            draggable="false"
            @mouseenter="launchConfetti"
            @click="launchConfetti"
          />

          <!-- Canvas ocupa todo el col; pointer-events-none para no interceptar clicks -->
          <canvas
            ref="confettiCanvas"
            class="pointer-events-none absolute inset-0 z-20 h-full w-full"
          />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CATALOG_PDF_PATH } from '~~/shared/catalogPdf'

// Textos editables por la dueña (site_content.hero); defaults = copy actual
const { data: hero } = useSiteSection('hero', {
  tagline: 'Eventos con alma',
  titulo: 'Momentos que ',
  titulo_span: 'perduran',
  subtitulo: 'Diseñamos experiencias únicas para cumpleaños, baby showers, comuniones y toda celebración que merezca ser recordada. Cada detalle cuidado con mimo para que tu historia sea inolvidable.',
  cta_principal: 'Diseñar mi evento',
  cta_secundario: 'Descargar Catálogo',
})

const catalogPdfUrl = storagePublicUrl('catalog', CATALOG_PDF_PATH)

const logoCol        = ref<HTMLDivElement | null>(null)
const confettiCanvas = ref<HTMLCanvasElement | null>(null)

let animationId: number | null = null
let lastLaunch = 0

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; color: string
  rotation: number; rotSpeed: number
  shape: 'rect' | 'circle'
  alpha: number; decay: number
}

const COLORS: string[] = ['#C9A96E', '#C4909A', '#8B3A2A', '#D4BFA0', '#E8D0C8', '#f9e4b7', '#f2c4ce']
const randomColor = (): string => COLORS[Math.floor(Math.random() * COLORS.length)] as string

function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const now = Date.now()
  if (now - lastLaunch < 600) return
  lastLaunch = now

  const canvas = confettiCanvas.value
  const col    = logoCol.value
  if (!canvas || !col) return

  // Iguala el canvas al tamaño real del contenedor
  canvas.width  = col.clientWidth
  canvas.height = col.clientHeight

  const ctx = canvas.getContext('2d')!

  // Origen: centro horizontal, 75 % de altura (base del logo)
  const ox = canvas.width  * 0.5
  const oy = canvas.height * 0.75

  const particles: Particle[] = Array.from({ length: 65 }, () => ({
    x:        ox + (Math.random() - 0.5) * canvas.width * 0.45,
    y:        oy,
    vx:       (Math.random() - 0.5) * 5,
    vy:       -(Math.random() * 7 + 3),
    size:     Math.random() * 7 + 3,
    color:    randomColor(),
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.22,
    shape:    (Math.random() > 0.4 ? 'rect' : 'circle') as 'rect' | 'circle',
    alpha:    1,
    decay:    Math.random() * 0.014 + 0.010,
  }))

  if (animationId !== null) cancelAnimationFrame(animationId)

  function draw() {
    const c = confettiCanvas.value
    if (!c) return
    ctx.clearRect(0, 0, c.width, c.height)
    let alive = false

    for (const p of particles) {
      if (p.alpha <= 0) continue
      alive = true
      p.x  += p.vx
      p.y  += p.vy
      p.vy += 0.2
      p.vx *= 0.99
      p.rotation += p.rotSpeed
      p.alpha    -= p.decay

      ctx.save()
      ctx.globalAlpha = Math.max(p.alpha, 0)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    if (alive) {
      animationId = requestAnimationFrame(draw)
    } else {
      ctx.clearRect(0, 0, c.width, c.height)
      animationId = null
    }
  }

  draw()
}

onUnmounted(() => {
  if (animationId !== null) cancelAnimationFrame(animationId)
})
</script>
