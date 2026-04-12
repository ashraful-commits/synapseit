'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 56%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`

const NOISE = `
vec3 _m289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 _m289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 _perm(vec4 x){return _m289v4(((x*34.)+1.)*x);}
vec4 _tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-.5;
  i=_m289v3(i);
  vec4 p=_perm(_perm(_perm(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=.142857142857*C.wyz-C.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 xv=x_*ns.x+ns.yyyy;
  vec4 yv=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(xv)-abs(yv);
  vec4 b0=vec4(xv.xy,yv.xy);
  vec4 b1=vec4(xv.zw,yv.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=_tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

export default function HeroSphere() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100)
    camera.position.z = 4.4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Glow disk behind sphere ─────────────────────────────────
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vec2 center = vUv - 0.5;
          float d = length(center);
          float pulse = sin(uTime * 0.7) * 0.07 + 0.93;
          float alpha = smoothstep(0.5, 0.0, d * pulse) * 0.32;
          vec3 col = mix(vec3(0.0, 0.1, 0.4), vec3(0.1, 0.2, 0.8), 1.0 - d * 2.0);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    })
    const glowGeo = new THREE.PlaneGeometry(5.5, 5.5)
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.z = -0.5
    scene.add(glow)

    // ── Morphing sphere ─────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(1.35, 192, 192)
    const sphereMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        ${NOISE}
        uniform float uTime;
        varying float vElevation;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 p = normalize(position);
          float e1 = snoise(p * 1.6 + uTime * 0.25) * 0.42;
          float e2 = snoise(p * 3.8 + uTime * 0.48 + 2.3) * 0.16;
          float e3 = snoise(p * 8.0 + uTime * 1.0 + 5.0) * 0.04;
          float elev = e1 + e2 + e3;
          vec3 displaced = p * (1.35 + elev);
          vElevation = elev;
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying float vElevation;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);

          float t = clamp(vElevation * 3.2 + 0.55, 0.0, 1.0);

          // Blue/Purple gradient
          vec3 coreCol   = vec3(0.01, 0.02, 0.10);
          vec3 midCol    = vec3(0.10, 0.29, 1.0);
          vec3 surfCol   = vec3(0.30, 0.45, 1.0);

          vec3 col = mix(coreCol, midCol, t);
          col = mix(col, surfCol, t * t);

          // Cyan/White rim
          vec3 rimCol = vec3(0.5, 0.8, 1.0);
          col = mix(col, rimCol, fresnel * 0.82);

          // Specular highlight
          vec3 L = normalize(vec3(2.0, 3.5, 4.0));
          vec3 H2 = normalize(L + viewDir);
          float spec = pow(max(dot(vNormal, H2), 0.0), 72.0);
          col += vec3(0.8, 0.9, 1.0) * spec * 0.7;

          float alpha = mix(0.6, 1.0, t) + fresnel * 0.3;
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
        }
      `,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    scene.add(sphere)

    // ── Orbiting particle halo ──────────────────────────────────
    const pCount = 2200
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = (Math.random() - 0.5) * Math.PI * 0.5
      const r     = 1.62 + Math.random() * 0.95
      pPos[i * 3]     = r * Math.cos(theta) * Math.cos(phi)
      pPos[i * 3 + 1] = r * Math.sin(phi) * 0.55
      pPos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x1a4aff,
      size: 0.016,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Second, dimmer outer halo ───────────────────────────────
    const p2Count = 800
    const p2Pos = new Float32Array(p2Count * 3)
    for (let i = 0; i < p2Count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = (Math.random() - 0.5) * Math.PI * 0.8
      const r     = 2.5 + Math.random() * 0.7
      p2Pos[i * 3]     = r * Math.cos(theta) * Math.cos(phi)
      p2Pos[i * 3 + 1] = r * Math.sin(phi) * 0.6
      p2Pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi)
    }
    const p2Geo = new THREE.BufferGeometry()
    p2Geo.setAttribute('position', new THREE.BufferAttribute(p2Pos, 3))
    const p2Mat = new THREE.PointsMaterial({
      color: 0x7300ff,
      size: 0.012,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
    })
    const outerParticles = new THREE.Points(p2Geo, p2Mat)
    scene.add(outerParticles)

    // ── Mouse & resize ──────────────────────────────────────────
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ─────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let id: number
    const animate = () => {
      id = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      sphereMat.uniforms.uTime.value = t
      glowMat.uniforms.uTime.value = t

      // Smooth mouse-reactive rotation + slow auto-spin
      sphere.rotation.x += (my * 0.28 - sphere.rotation.x) * 0.045
      sphere.rotation.y += (mx * 0.28 + t * 0.07 - sphere.rotation.y) * 0.045

      particles.rotation.y = t * 0.055
      particles.rotation.x = Math.sin(t * 0.035) * 0.18

      outerParticles.rotation.y = -t * 0.03
      outerParticles.rotation.z = t * 0.02

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      sphereGeo.dispose()
      sphereMat.dispose()
      glowGeo.dispose()
      glowMat.dispose()
      pGeo.dispose()
      pMat.dispose()
      p2Geo.dispose()
      p2Mat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <Wrapper ref={mountRef} />
}
