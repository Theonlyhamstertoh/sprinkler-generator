import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";

import { useMemo } from "react";
import * as THREE from "three";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 4, 4] }}>
      <color args={["#222"]} attach="background" />

      <OrbitControls />
      <Particles />
    </Canvas>
  );
}

const MAX_PARTICLES = 100000;
function Particles() {
  const {
    particles,
    radius,
    branch,
    randomPower,
    innerColor,
    outsideColor,
    spin
  } = useControls({
    particles: {
      value: 5000,
      min: 100,
      max: MAX_PARTICLES,
      step: 100
    },
    radius: { value: 10, max: 100, min: 1, step: 1 },
    spin: { value: 0.5, max: 1, min: 0, step: 0.01 },
    branch: { value: 4, max: 50, min: 1, step: 1 },
    randomPower: { value: 16, max: 64, min: 1, step: 1 },
    innerColor: "#ff0000",
    outsideColor: "#0000ff"
  });
  const [coords, colors] = useMemo(() => {
    const coords = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);
    const colorInside = new THREE.Color(innerColor);
    const colorOutside = new THREE.Color(outsideColor);

    for (let i = 0; i < particles; i++) {
      const i3 = i * 3;
      const radiusValue = (Math.random() - 0.5) * radius;
      const branchValue = ((i % branch) / branch) * Math.PI * 2;
      const spinAngle = spin * radiusValue;

      const randomY =
        Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1);

      coords[i3] = Math.cos(branchValue + spinAngle) * radiusValue;
      coords[i3 + 1] = randomY;
      coords[i3 + 2] = Math.sin(branchValue + spinAngle) * radiusValue;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radiusValue / radius);
      colors[i3 + 0] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    return [coords, colors];
  }, [particles, radius, branch, randomPower, innerColor, outsideColor, spin]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={coords.length / 3}
          array={coords}
          itemSize={3}
          onUpdate={(self) => (self.needsUpdate = true)}
        />
        <bufferAttribute
          attachObject={["attributes", "color"]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          onUpdate={(self) => (self.needsUpdate = true)}
        />
      </bufferGeometry>
      <pointsMaterial
        blending={THREE.AdditiveBlending}
        size="0.2"
        vertexColors={true}
        sizeAttenuation={true}
      />
    </points>
  );
}
