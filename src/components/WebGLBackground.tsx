'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`

const NOISE_GLSL = `
  vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289v4(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute4(vec4 x){return mod289v4(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt4(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-0.5;
    i=mod289v3(i);
    vec4 p=permute4(permute4(permute4(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    vec3 ns=0.142857142857*C.wyz-C.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 xv=x_*ns.x+ns.yyyy;
    vec4 yv=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(xv)-abs(yv);
    vec4 b0=vec4(xv.xy,yv.xy);
    vec4 b1=vec4(xv.zw,yv.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`

export default function WebGLBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    const W = mount.clientWidth
    const H = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 5, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Morphing wireframe terrain
    const geo = new THREE.PlaneGeometry(22, 14, 160, 100)
    geo.rotateX(-Math.PI / 2.4)

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uMX: { value: 0 },
        uMY: { value: 0 },
      },
      vertexShader: `
        ${NOISE_GLSL}
        uniform float uTime;
        uniform float uMX;
        uniform float uMY;
        varying float vElev;
        void main() {
          vec3 pos = position;
          float e1 = snoise(vec3(pos.xz * 0.22 + uTime * 0.07, 0.0));
          float e2 = snoise(vec3(pos.xz * 0.55 + uTime * 0.13, 1.5)) * 0.5;
          float e3 = snoise(vec3(pos.xz * 1.3 + uTime * 0.22, 3.0)) * 0.22;
          float e4 = snoise(vec3(pos.xz * 2.8 + uTime * 0.38, 5.5)) * 0.07;
          float dist = length(pos.xz - vec2(uMX * 7.0, uMY * 4.5));
          float ripple = sin(dist * 1.2 - uTime * 2.5) * 0.1 * exp(-dist * 0.3);
          float elevation = e1 + e2 + e3 + e4 + ripple;
          pos.y += elevation;
          vElev = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vElev;
        void main() {
          float t = clamp((vElev + 0.9) / 1.8, 0.0, 1.0);
          vec3 dark = vec3(0.055, 0.14, 0.085);
          vec3 bright = vec3(0.12, 0.42, 0.22);
          vec3 col = mix(dark, bright, t);
          float alpha = mix(0.1, 0.5, t);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    })

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // Floating particles above terrain
    const pCount = 600
    const pPos = new Float32Array(pCount * 3)
    const pAlpha = new Float32Array(pCount)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 22
      pPos[i * 3 + 1] = Math.random() * 5
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12
      pAlpha[i]       = Math.random()
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x30c878,
      size: 0.02,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(pGeo, pMat)
    scene.add(points)

    let mx = 0, my = 0
    let camX = 0, camY = 5
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

    const clock = new THREE.Clock()
    let id: number
    const animate = () => {
      id = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      mat.uniforms.uTime.value = t
      mat.uniforms.uMX.value += (mx - mat.uniforms.uMX.value) * 0.04
      mat.uniforms.uMY.value += (my - mat.uniforms.uMY.value) * 0.04

      camX += (mx * 0.9 - camX) * 0.025
      camY += (5 + my * 0.6 - camY) * 0.025
      camera.position.x = camX
      camera.position.y = camY
      camera.lookAt(0, 0, 0)

      points.rotation.y = t * 0.015
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      pGeo.dispose()
      pMat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <Wrapper ref={mountRef} />
}
