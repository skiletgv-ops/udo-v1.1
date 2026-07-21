import React, { useRef, useEffect, ReactNode } from "react";
import * as THREE from "three";

export interface SynapseBackgroundProps {
  children?: ReactNode;
  particleCount?: number;
  lineColor?: number;
  particleColor?: number;
  pulseColor?: number;
  connectionDistance?: number;
  width?: number;
  height?: number;
  ariaLabel?: string;
  className?: string;
}

const SynapseBackground: React.FC<SynapseBackgroundProps> = ({
  children,
  particleCount = 1500, // Optimized default for smooth 60fps execution without thread lock
  lineColor = 0x00ffff,
  particleColor = 0xffffff,
  pulseColor = 0xff00ff,
  connectionDistance = 80,
  width,
  height,
  ariaLabel = "Interactive 3D synapse network background",
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Build particles
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = Math.random() * 800 - 400;
      positions[i * 3 + 1] = Math.random() * 800 - 400;
      positions[i * 3 + 2] = Math.random() * 800 - 400;
      const c = new THREE.Color(particleColor);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true,
      })
    );
    scene.add(pts);

    // Build lines (optimized to prevent heavy main thread CPU lockup on high particle counts)
    const linePos: number[] = [];
    const pArr = geo.attributes.position.array as Float32Array;
    const checkCount = Math.min(particleCount, 600);
    for (let i = 0; i < checkCount; i++) {
      for (let j = i + 1; j < checkCount; j++) {
        const dx = pArr[i * 3] - pArr[j * 3];
        const dy = pArr[i * 3 + 1] - pArr[j * 3 + 1];
        const dz = pArr[i * 3 + 2] - pArr[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < connectionDistance) {
          linePos.push(
            pArr[i * 3],
            pArr[i * 3 + 1],
            pArr[i * 3 + 2],
            pArr[j * 3],
            pArr[j * 3 + 1],
            pArr[j * 3 + 2]
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePos), 3)
    );
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.15 })
    );
    scene.add(lines);

    // Mouse pulse vector (listening on window to detect motion over cover divs)
    const mouse = new THREE.Vector2(-100, -100);
    let hasMouseMoved = false;

    const onMouseMove = (e: MouseEvent) => {
      hasMouseMoved = true;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Preallocated color objects outside animation loop for 60fps zero-garbage-collection performance
    const baseColorObj = new THREE.Color(particleColor);
    const pulseColorObj = new THREE.Color(pulseColor);

    // Animation
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.003;

      // Rotate scene slowly
      scene.rotation.y += 0.0006;
      scene.rotation.x += 0.0003;

      // Add camera sway/breathing for beautiful organic 3D parallax drift
      camera.position.x = Math.sin(time) * 45;
      camera.position.y = Math.cos(time * 0.7) * 45;
      camera.lookAt(scene.position);

      // Determine the focal point of the pulse (use mouse pointer if active, else auto-oscillate)
      let ptr = new THREE.Vector3();
      if (hasMouseMoved) {
        const mv = new THREE.Vector3(mouse.x, mouse.y, 0.5)
          .unproject(camera)
          .sub(camera.position)
          .normalize();
        const dist = -camera.position.z / mv.z;
        ptr = camera.position.clone().add(mv.multiplyScalar(dist));
      } else {
        // High-tech automatic electrical wave traversing through the synapse network
        ptr.x = Math.sin(time * 1.5) * 250;
        ptr.y = Math.cos(time * 0.9) * 200;
        ptr.z = Math.sin(time * 0.7) * 150;
      }

      // Update particle colors for active glowing pulse effect
      const colArr = geo.attributes.color.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const dx = pArr[i * 3] - ptr.x;
        const dy = pArr[i * 3 + 1] - ptr.y;
        const dz = pArr[i * 3 + 2] - ptr.z;
        const distToPulse = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Dynamic pulse wave radius
        const t = Math.max(0, 1 - distToPulse / 110);
        
        // Pre-optimized linear interpolation mapping directly to the array elements without instantiation
        const targetR = baseColorObj.r + (pulseColorObj.r - baseColorObj.r) * Math.min(1, t * 1.2);
        const targetG = baseColorObj.g + (pulseColorObj.g - baseColorObj.g) * Math.min(1, t * 1.2);
        const targetB = baseColorObj.b + (pulseColorObj.b - baseColorObj.b) * Math.min(1, t * 1.2);
        
        colArr[i * 3] += (targetR - colArr[i * 3]) * 0.1;
        colArr[i * 3 + 1] += (targetG - colArr[i * 3 + 1]) * 0.1;
        colArr[i * 3 + 2] += (targetB - colArr[i * 3 + 2]) * 0.1;
      }
      geo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        const canvasEl = mountRef.current?.querySelector("canvas");
        if (canvasEl && mountRef.current) {
          mountRef.current.removeChild(canvasEl);
        }
        rendererRef.current = null;
      }
    };
  }, [
    particleCount,
    lineColor,
    particleColor,
    pulseColor,
    connectionDistance,
    width,
    height,
  ]);

  const hasBgClass = className.split(" ").some(c => c.startsWith("bg-"));
  const bgClass = hasBgClass ? "" : "bg-[#020813]";

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`relative overflow-hidden ${bgClass} ${className}`}
      style={{ 
        width: width !== undefined ? `${width}px` : (className.includes("w-full") || className.includes("w-screen") ? undefined : "100vw"), 
        height: height !== undefined ? `${height}px` : (className.includes("h-full") || className.includes("h-screen") ? undefined : "100vh")
      }}
    >
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default SynapseBackground;
