import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface TetrahedronProps {
  position: [number, number, number];
  color: string;
}

function Tetrahedron({ position, color }: TetrahedronProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.1 * delta;
      meshRef.current.rotation.y += 0.15 * delta;

      const targetScale = hovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        const targetEmissive = hovered ? new THREE.Color("#00D4AA") : new THREE.Color("#000000");
        mat.emissive.lerp(targetEmissive, 0.1);
        mat.emissiveIntensity = hovered ? 0.3 : 0;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <tetrahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function ParticlesField() {
  const groupRef = useRef<THREE.Group>(null!);

  const { positions, colors } = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const copperColor = new THREE.Color("#B87333");
    const cyanColor = new THREE.Color("#00D4AA");

    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const mixRatio = Math.random();
      const particleColor = copperColor.clone().lerp(cyanColor, mixRatio);

      col[i * 3] = particleColor.r;
      col[i * 3 + 1] = particleColor.g;
      col[i * 3 + 2] = particleColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    const targetX = mouseRef.current.x * 1.5;
    const targetY = -mouseRef.current.y * 1.5;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function SplineBackground() {
  const tetrahedrons: Array<{ position: [number, number, number]; color: string }> = [
    { position: [-3.2, 1.8, -1.0], color: "#B87333" },
    { position: [3.4, -1.4, 0.5], color: "#CD7F32" },
    { position: [-2.2, -2.2, -0.8], color: "#A0522D" },
    { position: [2.8, 2.3, -1.5], color: "#E8A87C" },
    { position: [0.0, 3.2, -2.5], color: "#B87333" },
    { position: [-3.5, -0.8, 1.2], color: "#CD7F32" },
  ];

  return (
    <div className="fixed inset-0 z-0 bg-[#0a0a0f] overflow-hidden pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#0a0a0f', 10, 35]} />

        <directionalLight position={[5, 10, 7]} intensity={1.5} color="#B87333" />
        <pointLight position={[-5, -5, 5]} intensity={2.0} color="#00D4AA" />
        <pointLight position={[5, 5, -5]} intensity={2.0} color="#CD7F32" />
        <ambientLight intensity={0.4} />

        {tetrahedrons.map((tetra, idx) => (
          <Tetrahedron key={idx} position={tetra.position} color={tetra.color} />
        ))}

        <ParticlesField />

        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

        <CameraRig />
      </Canvas>
    </div>
  );
}

export default SplineBackground;
