import "./styles.css";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useControls } from "leva";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense, useCallback, useMemo, useState } from "react";
import * as THREE from "three";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 4, 4] }}>
      <color args={["#222"]} attach="background" />
      <gridHelper args={20} />
      <OrbitControls />
      <Particles />
      <axesHelper args={10} position={[0, 0.001, 0]} />
    </Canvas>
  );
}

function Particles() {
  const { particles, radius } = useControls({
    particles: {
      max: 1000,
      min: 10,
      step: 10,
      value: 100
    },
    radius: {
      min: 1,
      max: 10,
      step: 1,
      value: 2
    },
    angle: {}
  });

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      const i3 = i * 3;
      const radiusValue = Math.random() * radius;
      const angleValue = Math.random();
      positions[i3] = Math.cos(Math.PI * 2) * radiusValue;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      colors[i3] = Math.random();
      colors[i3 + 1] = Math.random();
      colors[i3 + 2] = Math.random();
    }

    return [positions, colors];
  }, [particles]);

  return (
    <points key={particles}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={particles / 3}
          itemSize={3}
          array={positions}
        />
        <bufferAttribute
          attachObject={["attributes", "color"]}
          count={particles / 3}
          itemSize={3}
          array={colors}
        />
      </bufferGeometry>
      <pointsMaterial
        size="0.2"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors={true}
      />
    </points>
  );
}
