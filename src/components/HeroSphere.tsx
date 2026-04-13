'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: -4%;
  width: 58%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`

/* ── Trigonometric FBm — no GLSL needed ─────────────────────────── */
function fbm(nx: number, ny: number, nz: number, t: number): number {
  const s = Math.sin, c = Math.cos
  return (
    s(nx * 3.10 + t * 0.23) * c(ny * 2.60 + t * 0.17) * 0.28 +
    s(ny * 5.70 + t * 0.46 + 1.8) * c(nz * 4.20 + t * 0.33) * 0.12 +
    s(nz * 8.90 + t * 0.89 + 4.1) * c(nx * 7.10 + t * 0.74) * 0.05
  )
}

export default function HeroSphere() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    /* ── Scene ── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
    camera.position.set(0, 0, 5.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0, 0)
    mount.appendChild(renderer.domElement)

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x0a1a66, 2.5))

    const keyLight = new THREE.PointLight(0x1a4aff, 18, 22)
    keyLight.position.set(4, 5, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x0044cc, 8, 18)
    fillLight.position.set(-5, -2, 3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x88ccff, 4)
    rimLight.position.set(-3, 2, -4)
    scene.add(rimLight)

    /* ── Radial glow disc (canvas texture → sprite) ── */
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 512
    const gc = glowCanvas.getContext('2d')!
    const rg = gc.createRadialGradient(256, 256, 0, 256, 256, 256)
    rg.addColorStop(0,   'rgba(26, 74, 255, 0.60)')
    rg.addColorStop(0.4, 'rgba(14, 40, 200, 0.22)')
    rg.addColorStop(1,   'rgba(0,   0,   0,  0.00)')
    gc.fillStyle = rg
    gc.fillRect(0, 0, 512, 512)
    const glowTex   = new THREE.CanvasTexture(glowCanvas)
    const glowMat   = new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 })
    const glowSprite = new THREE.Sprite(glowMat)
    glowSprite.scale.set(4.2, 4.2, 1)
    glowSprite.position.z = -0.8
    scene.add(glowSprite)

    /* ── Main sphere: IcosahedronGeometry gives organic feel ── */
    const GEO_DETAIL = 64   // smooth
    const RADIUS     = 1.12
    const geo        = new THREE.SphereGeometry(RADIUS, GEO_DETAIL, GEO_DETAIL)
    const origPos    = Float32Array.from(geo.attributes.position.array)
    const count      = geo.attributes.position.count

    const mat = new THREE.MeshPhongMaterial({
      color:       new THREE.Color(0x0d2ccc),
      emissive:    new THREE.Color(0x050d40),
      emissiveIntensity: 0.6,
      specular:    new THREE.Color(0x88aaff),
      shininess:   120,
      transparent: true,
      opacity:     0.95,
    })
    const sphere = new THREE.Mesh(geo, mat)
    scene.add(sphere)

    /* ── Edge wireframe (icosa for polygon aesthetic) ── */
    const wireGeo = new THREE.IcosahedronGeometry(RADIUS + 0.005, 4)
    const wireMat = new THREE.MeshBasicMaterial({
      color:       0x2255ff,
      wireframe:   true,
      transparent: true,
      opacity:     0.12,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wire)

    /* ── Particle halo ── */
    const pCount = 1400
    const pArr   = new Float32Array(pCount * 3)
    // Seeded random for SSR consistency
    let seed = 42
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

    for (let i = 0; i < pCount; i++) {
      const th = rand() * Math.PI * 2
      const ph = (rand() - 0.5) * Math.PI * 0.42
      const r  = 1.42 + rand() * 0.72
      pArr[i*3]   = r * Math.cos(th) * Math.cos(ph)
      pArr[i*3+1] = r * Math.sin(ph) * 0.48
      pArr[i*3+2] = r * Math.sin(th) * Math.cos(ph)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3))
    const pMat = new THREE.PointsMaterial({ color: 0x1a55ff, size: 0.011, transparent: true, opacity: 0.38, sizeAttenuation: true })
    const ring = new THREE.Points(pGeo, pMat)
    scene.add(ring)

    /* ── Vertex morph ── */
    const posAttr = geo.attributes.position
    const tmpV    = new THREE.Vector3()

    /* ── Mouse tracking (normalised -1..+1) ── */
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0

    const onMouse = (e: MouseEvent) => {
      targetX =  (e.clientX / window.innerWidth)  * 2 - 1
      targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* ── Animate ── */
    const clock = new THREE.Clock()
    let rafId: number

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse lerp
      currentX += (targetX - currentX) * 0.07
      currentY += (targetY - currentY) * 0.07

      // CPU vertex morph
      for (let i = 0; i < count; i++) {
        const ox = origPos[i*3], oy = origPos[i*3+1], oz = origPos[i*3+2]
        const len  = Math.sqrt(ox*ox + oy*oy + oz*oz)
        const nx = ox / len, ny = oy / len, nz = oz / len
        const elev = fbm(nx, ny, nz, t) * 0.80
        const r = len + elev
        posAttr.setXYZ(i, nx*r, ny*r, nz*r)
      }
      posAttr.needsUpdate = true
      geo.computeVertexNormals()

      // Rotation: auto-spin on Y + mouse tilt on X/Y
      sphere.rotation.y = t * 0.07 + currentX * 0.50
      sphere.rotation.x = currentY * 0.30

      // Wireframe morphs with different detail so it diverges slightly → organic feel
      wire.rotation.y = t * 0.055 + currentX * 0.45
      wire.rotation.x = currentY * 0.28

      // Particle ring slow independent orbit
      ring.rotation.y = t * 0.045
      ring.rotation.x = Math.sin(t * 0.022) * 0.12

      // Emissive pulse
      mat.emissiveIntensity = Math.sin(t * 1.1) * 0.08 + 0.62

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      geo.dispose();  mat.dispose()
      wireGeo.dispose(); wireMat.dispose()
      pGeo.dispose(); pMat.dispose()
      glowTex.dispose(); glowMat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <Wrapper ref={mountRef} />
}
