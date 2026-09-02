<template>
  <div
    class="relative isolate aspect-square w-full overflow-hidden rounded-xl border border-default bg-[#0a0a0a]"
    style="--up: #00ff70; --outpost: #2e8bff"
  >
    <div ref="container" class="absolute inset-0" aria-hidden="true" />
    <div
      class="pointer-events-none absolute top-3 left-1/2 flex -translate-x-1/2 items-center gap-4 text-[11px] whitespace-nowrap text-white/60"
    >
      <span class="inline-flex items-center gap-1.5">
        <span class="size-1.5 rounded-full" style="background: var(--up)" /> {{ t.legendUpcore }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="size-1.5 rounded-full" style="background: var(--outpost)" /> {{ t.legendOutposts }}
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="size-1.5 rounded-full bg-white" /> {{ t.legendServices }}
      </span>
    </div>
    <!-- The outpost lockup carries the same white/blue/cyan the scene paints
         its markers with, so it sits on the panel as a caption, not a badge. -->
    <img
      src="/logo/Outpost_Logo_Duotone_Primary_Light_NB.svg"
      alt="Outpost"
      class="pointer-events-none absolute bottom-4 left-5 h-4 w-auto opacity-70"
    >
    <div
      v-if="tooltip"
      class="pointer-events-none absolute z-10 max-w-[240px] -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-[#111]/95 px-3 py-2 text-white shadow-xl backdrop-blur"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y - 12}px` }"
    >
      <p class="flex items-center gap-1.5 text-xs font-medium">
        <span class="size-1.5 shrink-0 rounded-full" :style="{ background: tooltip.color }" />
        {{ tooltip.name }}
      </p>
      <p class="mt-0.5 text-[11px] text-white/60">{{ tooltip.desc }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import dots from '~/assets/data/globe-dots.json'

// The docs carry no message catalogue — i18n here is only the URL prefix, so
// the two strings tables live with the component that needs them.
const TEXT = {
  en: {
    legendUpcore: 'upcore',
    legendOutposts: 'Outposts',
    legendServices: 'Your services',
    upcoreName: 'upcore',
    upcoreDesc: 'Your instance: dispatches checks to every outpost and collects the results.',
    outpostPrefix: 'Outpost',
    outpostDesc: 'Runs checks from this location and reports the results back to upcore.',
    serviceDesc: 'Monitored service — checked from multiple locations.',
  },
  de: {
    legendUpcore: 'upcore',
    legendOutposts: 'Outposts',
    legendServices: 'Deine Dienste',
    upcoreName: 'upcore',
    upcoreDesc: 'Deine Instanz: dispatcht Checks an alle Outposts und sammelt die Ergebnisse ein.',
    outpostPrefix: 'Outpost',
    outpostDesc: 'Führt Checks von diesem Standort aus und meldet die Ergebnisse an upcore zurück.',
    serviceDesc: 'Überwachter Dienst — wird von mehreren Standorten aus geprüft.',
  },
}

const route = useRoute()
const t = computed(() => (route.path.startsWith('/de') ? TEXT.de : TEXT.en))

const container = ref<HTMLElement>()
const tooltip = ref<{ x: number; y: number; name: string; desc: string; color: string } | null>(null)

// The scene tells the outpost story: one green upcore instance dispatches
// checks to blue outposts, each outpost probes every white monitored service
// and reports the results back to upcore.
const UPCORE_LOC: [number, number] = [50.48, 12.37] // Falkenstein, DE

// Outposts (lat, lng, city)
const OUTPOSTS: { lat: number; lng: number; name: string }[] = [
  { lat: 50.11, lng: 8.68, name: 'Frankfurt' },
  { lat: 51.51, lng: -0.13, name: 'London' },
  { lat: 40.71, lng: -74.01, name: 'New York' },
  { lat: -23.55, lng: -46.63, name: 'São Paulo' },
  { lat: 1.35, lng: 103.82, name: 'Singapore' },
  { lat: 35.68, lng: 139.69, name: 'Tokyo' },
]

// Monitored services; every outpost checks all of them (that's the point)
const SERVICES: { lat: number; lng: number; name: string }[] = [
  { lat: 52.37, lng: 4.9, name: 'example.com' }, // Amsterdam
  { lat: 39.04, lng: -77.49, name: 'api.example.com' }, // Ashburn
  { lat: 19.08, lng: 72.88, name: 'cdn.example.com' }, // Mumbai
]

const UP = 0x00ff70
const OUTPOST = 0x2e8bff
const OUTPOST_CYAN = 0x4dd9e8
const SERVICE = 0xffffff
const R = 1

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function arcPoints(from: THREE.Vector3, to: THREE.Vector3, segments: number): THREE.Vector3[] {
  const dist = from.distanceTo(to)
  const mid1 = from.clone().lerp(to, 0.33).normalize().multiplyScalar(R * (1 + dist * 0.28))
  const mid2 = from.clone().lerp(to, 0.66).normalize().multiplyScalar(R * (1 + dist * 0.28))
  return new THREE.CubicBezierCurve3(from, mid1, mid2, to).getPoints(segments)
}

let renderer: THREE.WebGLRenderer | undefined
let frame = 0
let cleanupResize: (() => void) | undefined
let cleanupPointer: (() => void) | undefined

onMounted(() => {
  const el = container.value
  if (!el) {
    console.error('[TheGlobe] container ref missing, skipping globe init')
    return
  }
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0.4, 3.55)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const globe = new THREE.Group()
  // Tilt like a desk globe and start with Europe facing the camera
  globe.rotation.z = -0.15
  globe.rotation.y = 4.2
  scene.add(globe)

  // Land dots
  const dotGeo = new THREE.BufferGeometry()
  const positions = new Float32Array(dots.length * 3)
  for (let i = 0; i < dots.length; i++) {
    const [lat, lng] = dots[i] as [number, number]
    const v = latLngToVec3(lat, lng, R)
    positions.set([v.x, v.y, v.z], i * 3)
  }
  dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const dotMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.0105,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  const landDots = new THREE.Points(dotGeo, dotMat)
  globe.add(landDots)

  // Faint inner sphere so the back-side dots read as "behind" the globe.
  // All transparent objects here share the same origin, so three.js' distance
  // sort can't order them — without explicit renderOrder the sphere may be
  // drawn on top of the dots and blank out the whole globe. The sphere must
  // render first (writing depth), the dots after it.
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.995, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.92 }),
  )
  sphere.renderOrder = 0
  landDots.renderOrder = 1
  globe.add(sphere)

  // Soft atmosphere rim
  const rim = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.02, 48, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { c: { value: new THREE.Color(UP) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 c;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, -1.0)), 3.0);
          gl_FragColor = vec4(c, 1.0) * intensity * 0.35;
        }`,
    }),
  )
  rim.renderOrder = 2
  globe.add(rim)

  // Markers: upcore (green), outposts (blue), services (white) — each with a
  // pulsing halo and an invisible, larger hit sphere for hover tooltips.
  const markerGroup = new THREE.Group()
  const halos: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; base: number }[] = []
  const hitSpheres: THREE.Mesh[] = []
  const hitGeo = new THREE.SphereGeometry(0.055, 8, 8)

  const addMarker = (
    v: THREE.Vector3,
    color: number,
    size: number,
    haloOpacity: number,
    info: { name: string; desc: string; color: string },
  ) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(size, 12, 12), new THREE.MeshBasicMaterial({ color }))
    m.position.copy(v)
    markerGroup.add(m)
    const haloMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: haloOpacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const halo = new THREE.Mesh(new THREE.CircleGeometry(0.035, 24), haloMat)
    halo.position.copy(v)
    halo.lookAt(v.clone().multiplyScalar(2))
    halos.push({ mesh: halo, mat: haloMat, base: haloOpacity })
    markerGroup.add(halo)
    const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
    hit.position.copy(v)
    hit.userData = info
    hitSpheres.push(hit)
    markerGroup.add(hit)
  }

  const upcoreV = latLngToVec3(...UPCORE_LOC, R * 1.002)
  addMarker(upcoreV, UP, 0.02, 0.45, {
    name: t.value.upcoreName,
    desc: t.value.upcoreDesc,
    color: 'var(--up)',
  })
  const outpostVs = OUTPOSTS.map((o) => latLngToVec3(o.lat, o.lng, R * 1.002))
  for (let i = 0; i < OUTPOSTS.length; i++) {
    addMarker(outpostVs[i]!, OUTPOST, 0.015, 0.4, {
      name: `${t.value.outpostPrefix} ${OUTPOSTS[i]!.name}`,
      desc: t.value.outpostDesc,
      color: 'var(--outpost)',
    })
  }
  const serviceVs = SERVICES.map((s) => latLngToVec3(s.lat, s.lng, R * 1.002))
  for (let i = 0; i < SERVICES.length; i++) {
    addMarker(serviceVs[i]!, SERVICE, 0.012, 0.25, {
      name: SERVICES[i]!.name,
      desc: t.value.serviceDesc,
      color: '#ffffff',
    })
  }
  globe.add(markerGroup)

  // Arcs and pulses. Per outpost the cycle plays the dispatch model:
  //   1. upcore → outpost   (green: the check batch)
  //   2. outpost → service  (cyan: the probe)
  //   3. service → outpost  (white: the answer)
  //   4. outpost → upcore   (blue: the result)
  const ARC_POINTS = 96
  const pulses: {
    line: THREE.Line
    mat: THREE.LineBasicMaterial
    start: number
    end: number
  }[] = []

  const addTrail = (points: THREE.Vector3[], color: number, opacity: number) => {
    const trail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
    )
    trail.renderOrder = 3
    globe.add(trail)
  }

  const addPulse = (points: THREE.Vector3[], color: number, start: number, end: number) => {
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat)
    line.geometry.setDrawRange(0, 0)
    line.renderOrder = 3
    globe.add(line)
    pulses.push({ line, mat, start, end })
  }

  // All outposts play the cycle in lockstep: one dispatch reaches every
  // outpost at once, then every outpost probes every service at once, and
  // every result returns to upcore at once.
  const CYCLE = 6
  for (let i = 0; i < OUTPOSTS.length; i++) {
    const dispatch = arcPoints(upcoreV, outpostVs[i]!, ARC_POINTS)
    addTrail(dispatch, UP, 0.08)
    addPulse(dispatch, UP, 0, 1.1)
    addPulse([...dispatch].reverse(), OUTPOST, 2.8, 3.9)
    for (const sv of serviceVs) {
      const probe = arcPoints(outpostVs[i]!, sv, ARC_POINTS)
      addTrail(probe, SERVICE, 0.05)
      addPulse(probe, OUTPOST_CYAN, 1.3, 1.9)
      addPulse([...probe].reverse(), SERVICE, 2.0, 2.6)
    }
  }

  // Sizing
  const resize = () => {
    const w = el.clientWidth
    const h = el.clientHeight
    if (w === 0 || h === 0) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer!.setSize(w, h)
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(el)
  cleanupResize = () => ro.disconnect()

  // Hover: raycast the hit spheres; the occluder sphere shadows markers on
  // the far side so only front-facing points get a tooltip. Rotation pauses
  // while a tooltip is open so it stays under the cursor.
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const canvas = renderer.domElement
  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects([sphere, ...hitSpheres], false)[0]
    if (hit && hit.object !== sphere) {
      const info = hit.object.userData as { name: string; desc: string; color: string }
      tooltip.value = { x: e.clientX - rect.left, y: e.clientY - rect.top, ...info }
      canvas.style.cursor = 'pointer'
    } else {
      tooltip.value = null
      canvas.style.cursor = ''
    }
  }
  const onPointerLeave = () => {
    tooltip.value = null
    canvas.style.cursor = ''
  }
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  cleanupPointer = () => {
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerleave', onPointerLeave)
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const clock = new THREE.Clock()

  const animate = () => {
    frame = requestAnimationFrame(animate)
    const time = clock.getElapsedTime()
    if (!reduceMotion) {
      if (!tooltip.value) {
        globe.rotation.y += 0.0011
      }
      const WINDOW = 18
      for (const { line, mat, start, end } of pulses) {
        const tc = time % CYCLE
        const prog = (tc - start) / (end - start)
        if (prog >= 0 && prog <= 1) {
          const head = Math.floor(prog * (ARC_POINTS + WINDOW))
          const from = Math.max(0, head - WINDOW)
          const count = Math.min(head, ARC_POINTS) - from
          line.geometry.setDrawRange(from, Math.max(count, 0))
          mat.opacity = 0.9
        } else {
          mat.opacity = 0
        }
      }
      for (let i = 0; i < halos.length; i++) {
        const s = 0.65 + 0.35 * Math.sin(time * 2 + i * 1.3)
        halos[i]!.mesh.scale.setScalar(0.6 + s * 0.55)
        halos[i]!.mat.opacity = halos[i]!.base * (1 - s * 0.7)
      }
    }
    renderer!.render(scene, camera)
  }
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  cleanupResize?.()
  cleanupPointer?.()
  renderer?.dispose()
  renderer?.domElement.remove()
})
</script>
