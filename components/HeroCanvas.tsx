"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Waves() {
  const mesh = useRef<THREE.Mesh>(null!);
  const geom = new THREE.PlaneGeometry(8, 4, 100, 50);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x22d3ee) },
      uOpacity: { value: 0.22 },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float wave1 = sin((pos.x * 2.0 + uTime * 0.8)) * 0.06;
        float wave2 = cos((pos.y * 3.0 - uTime * 1.2)) * 0.04;
        pos.z += wave1 + wave2;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        float edge = smoothstep(0.0, 0.02, vUv.y) * (1.0 - smoothstep(0.98, 1.0, vUv.y));
        float alpha = uOpacity * (0.5 + 0.5 * edge);
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    depthWrite: false,
  });

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.getElapsedTime();
  });

  // @ts-expect-error - jsx-intrinsic types are provided by fiber at runtime
  return <mesh ref={mesh as any} position={[0, 0, 0]} geometry={geom} material={mat} />;
}

export default function HeroCanvas() {
  return (
    <Canvas className="absolute inset-0" gl={{ antialias: true, alpha: true }}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={120} />
      <Waves />
    </Canvas>
  );
}
