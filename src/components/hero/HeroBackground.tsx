"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= aspect;

    float t = uTime * 0.045;

    // Domain-warped flow for a slow, living gradient.
    vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.2));
    float f = fbm(p * 2.0 + q * 1.25 + t * 0.5);

    // Brand palette — mirrors the @theme tokens in globals.css.
    vec3 ivory = vec3(0.992, 0.965, 0.933); // #fdf6ee
    vec3 cream = vec3(0.965, 0.847, 0.741); // #f6d8bd  peach
    vec3 sand  = vec3(0.941, 0.769, 0.624); // #f0c49f
    vec3 coral = vec3(0.953, 0.576, 0.600); // #f39399
    vec3 pink  = vec3(0.812, 0.255, 0.451); // #cf4173

    // Coral and pink are far more saturated than the camel/gold they replace,
    // so the top two mix weights come down to hold the same visual weight —
    // at the old 0.45 the whole hero went hot pink.
    vec3 col = mix(ivory, cream, smoothstep(0.2, 0.85, f));
    col = mix(col, sand, smoothstep(0.45, 0.95, q.x) * 0.7);
    col = mix(col, coral, smoothstep(0.62, 1.0, f * q.y) * 0.34);
    col = mix(col, pink, smoothstep(0.86, 1.0, q.y) * 0.08);

    // Warmth pooling toward the portrait side (upper-right).
    float glow = smoothstep(1.15, 0.15, distance(uv, vec2(0.74, 0.42)));
    col = mix(col, mix(col, pink, 0.05), glow);

    // Soft vignette.
    float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.5)));
    col *= mix(0.965, 1.0, vig);

    // Fine film grain.
    float g = hash(gl_FragCoord.xy + uTime) * 0.035 - 0.0175;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GradientQuad({ reduce }: { reduce: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    if (!reduce) mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uResolution.value.set(
      state.size.width * state.viewport.dpr,
      state.size.height * state.viewport.dpr,
    );
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </ScreenQuad>
  );
}

export default function HeroBackground() {
  const reduce = useReducedMotion() ?? false;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(true);

  // The fbm shader is expensive — stop rendering once the hero is scrolled
  // out of view, or it eats the frame budget of the whole page.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false }}
      frameloop={reduce || !inView ? "demand" : "always"}
      style={{ position: "absolute", inset: 0 }}
    >
      <GradientQuad reduce={reduce} />
    </Canvas>
  );
}
