"use client"

import React, { Suspense, useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  Plane,
  Sphere,
} from "@react-three/drei";
import { Download, Heart, X, Sparkles, Activity, Video, MessageSquare, LineChart, Cpu } from "lucide-react";
import { FUNCTIONS_CARDS, Card } from "../data/functionsData";
import { Component as AsciiOrbBackground } from "./ui/artificial-hero";
import { SplineScene } from "./ui/splite";

/**
 * Single-file Stellar Card Gallery Integrated into U.D.O. Clinical Platform
 */

/* =========================
   Card Context (inlined)
   ========================= */

interface CardContextType {
  selectedCard: Card | null;
  setSelectedCard: (card: Card | null) => void;
  cards: Card[];
  isFavoritedMap: Record<string, boolean>;
  toggleFavorite: (id: string) => void;
  setActiveView: (view: string | null) => void;
  setActiveFunctionId?: (id: string | null) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard must be used within CardProvider");
  return ctx;
}

function CardProvider({ children, activeView, setActiveView, setActiveFunctionId }: { children: React.ReactNode; activeView: string | null; setActiveView: (view: string | null) => void; setActiveFunctionId?: (id: string | null) => void }) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isFavoritedMap, setIsFavoritedMap] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setIsFavoritedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const cards: Card[] = FUNCTIONS_CARDS;

  return (
    <CardContext.Provider value={{ selectedCard, setSelectedCard, cards, isFavoritedMap, toggleFavorite, setActiveView, setActiveFunctionId }}>
      {children}
    </CardContext.Provider>
  );
}

/* =========================
   Starfield Background (inlined raw canvas renderer)
   ========================= */

function StarfieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // fully transparent to show gradient below
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 4000; // fewer, higher quality larger bokeh dots
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1600;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0x31b8c6, 
      size: 1.8, 
      sizeAttenuation: true, 
      transparent: true, 
      opacity: 0.45 
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 10;

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      stars.rotation.y += 0.00015;
      stars.rotation.x += 0.00008;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 bg-gradient-to-br from-[#f8fafc] via-[#f0fcfd] to-[#f5f3ff] pointer-events-none" />;
}

/* =========================
   Floating Card (inlined)
   ========================= */

function FloatingCard({
  card,
  position,
}: {
  card: Card;
  position: { x: number; y: number; z: number; rotationX: number; rotationY: number; rotationZ: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setActiveView } = useCard();

  const basePos = useMemo(() => new THREE.Vector3(position.x, position.y, position.z), [position]);
  const currentPos = useRef(new THREE.Vector3(position.x, position.y, position.z));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera, pointer }) => {
    // 1. Project the card's 3D position to screen space (NDC)
    const cardProj = currentPos.current.clone().project(camera);

    const dx = cardProj.x - pointer.x;
    const dy = cardProj.y - pointer.y;
    const distance2D = Math.sqrt(dx * dx + dy * dy);

    const repulsionForce = new THREE.Vector3(0, 0, 0);

    // 2. If close, apply push force away from pointer
    if (distance2D < 0.5) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      
      const angle = Math.atan2(dy, dx);
      // Pushing magnitude is stronger when pointer is closer
      const forceMagnitude = (0.5 - distance2D) * 16.0;

      repulsionForce.addScaledVector(right, Math.cos(angle) * forceMagnitude);
      repulsionForce.addScaledVector(up, Math.sin(angle) * forceMagnitude);

      // Add depth repulsion too (pushing back slightly)
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
      repulsionForce.addScaledVector(forward, -forceMagnitude * 0.4);
    }

    // 3. Spring back to original base position
    const springForce = new THREE.Vector3()
      .subVectors(basePos, currentPos.current)
      .multiplyScalar(4.0); // stiffness

    // 4. Sum forces (stiffness, repulsion, damping)
    const acceleration = new THREE.Vector3().addVectors(springForce, repulsionForce);

    velocity.current.addScaledVector(acceleration, 0.016);
    velocity.current.multiplyScalar(0.85); // friction

    currentPos.current.addScaledVector(velocity.current, 1);

    if (groupRef.current) {
      groupRef.current.position.copy(currentPos.current);
      groupRef.current.lookAt(camera.position);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveView(card.moduleId);
  };
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Plane
        ref={meshRef}
        args={[4.5, 6]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>

      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          pointerEvents: "none",
        }}
      >
        <div
          className="w-40 h-52 rounded-xl overflow-hidden shadow-xl bg-white/90 backdrop-blur-md p-3 select-none"
          style={{
            boxShadow: hovered
              ? "0 20px 40px rgba(49, 184, 198, 0.25), 0 0 25px rgba(49, 184, 198, 0.15)"
              : "0 8px 24px rgba(0, 0, 0, 0.05)",
            border: hovered ? "2px solid rgba(49, 184, 198, 0.6)" : "1px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          <img
            src={card.imageUrl || "/placeholder.svg"}
            alt={card.alt}
            className="w-full h-40 object-cover rounded-lg"
            loading="lazy"
            draggable={false}
          />
          <div className="mt-1 text-center flex flex-col justify-center h-8">
            <p className="text-slate-800 text-xs font-bold truncate leading-tight">{card.title}</p>
            <p className="text-teal-600 font-mono text-[8px] uppercase tracking-wider mt-0.5 truncate leading-tight font-extrabold">
              {card.moduleName}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}

/* =========================
   Card Modal (inlined)
   ========================= */

interface CardModalProps {
  setActiveView: (view: string | null) => void;
}

function CardModal({ setActiveView }: CardModalProps) {
  const { selectedCard, setSelectedCard, isFavoritedMap, toggleFavorite, setActiveFunctionId } = useCard();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!selectedCard) return null;

  const isFavorited = !!isFavoritedMap[selectedCard.id];

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease-out";
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  const handleClose = () => setSelectedCard(null);
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md pointer-events-auto" onClick={handleBackdropClick}>
      <div className="relative max-w-md w-full mx-4">
        <button onClick={handleClose} className="absolute -top-12 right-0 text-slate-800 hover:text-slate-950 bg-white/90 hover:scale-105 p-2 rounded-full shadow-lg transition-all z-10">
          <X className="w-5 h-5" />
        </button>

        <div style={{ perspective: "1000px" }} className="w-full">
          <div
            ref={cardRef}
            className="relative cursor-pointer rounded-[24px] bg-white/95 p-5 transition-all duration-500 ease-out w-full border border-white/80 shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
            style={{
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full mb-4" style={{ aspectRatio: "3 / 4" }}>
              <img
                loading="lazy"
                className="absolute inset-0 h-full w-full rounded-[18px] bg-slate-100 object-cover border border-slate-200/50"
                alt={selectedCard.alt}
                src={selectedCard.imageUrl || "/placeholder.svg"}
                style={{ boxShadow: "rgba(0, 0, 0, 0.04) 0px 8px 16px 0px", opacity: 1 }}
              />
            </div>

            <div className="text-center mb-3">
              <span className="text-[10px] font-mono tracking-widest text-teal-700 uppercase font-bold bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
                {selectedCard.category}
              </span>
            </div>

            <h3 className="text-slate-900 text-lg font-bold mb-1 text-center">{selectedCard.title}</h3>
            <p className="text-slate-500 font-mono text-[10px] text-center uppercase tracking-wider mb-4 font-semibold">
              U.D.O. Dienst: {selectedCard.moduleName}
            </p>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  if (setActiveFunctionId) {
                    setActiveFunctionId(selectedCard.id);
                  } else {
                    setActiveView(selectedCard.moduleId);
                  }
                  setSelectedCard(null);
                }}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl text-xs font-bold text-white outline-none transition duration-300 ease-out hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]"
                style={{ backgroundColor: "#14b8a6" }}
              >
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Dienst Ausführen</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(selectedCard.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 outline-none transition duration-300 ease-out active:scale-[0.98]"
              >
                <Heart className="h-4 w-4" strokeWidth={2} fill={isFavorited ? "#14b8a6" : "none"} />
              </button>
            </div>

            {/* Launch clinical module button in modal */}
            <button
              type="button"
              onClick={() => {
                if (setActiveFunctionId) {
                  setActiveFunctionId(selectedCard.id);
                } else {
                  setActiveView(selectedCard.moduleId);
                }
                setSelectedCard(null);
              }}
              className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 active:scale-[0.98] transition duration-300 border-none shadow-md shadow-teal-500/10"
            >
              {selectedCard.moduleId === "video" && <Video size={13} />}
              {selectedCard.moduleId === "workflow" && <Activity size={13} />}
              {selectedCard.moduleId === "chat" && <MessageSquare size={13} />}
              {selectedCard.moduleId === "upgrades" && <Sparkles size={13} />}
              {selectedCard.moduleId === "analytics" && <LineChart size={13} />}
              {selectedCard.moduleId === "eeg" && <Cpu size={13} />}
              <span>In U.D.O. Bereich laden &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Card Galaxy (inlined)
   ========================= */

function CardGalaxy() {
  const { cards } = useCard();

  const cardPositions = useMemo(() => {
    const positions: {
      x: number;
      y: number;
      z: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
    }[] = [];
    const numCards = cards.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numCards; i++) {
      const y = 1 - (i / (numCards - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = (2 * Math.PI * i) / goldenRatio;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const layerRadius = 12 + (i % 3) * 4;

      positions.push({
        x: x * layerRadius,
        y: y * layerRadius,
        z: z * layerRadius,
        rotationX: Math.atan2(z, Math.sqrt(x * x + y * y)),
        rotationY: Math.atan2(x, z),
        rotationZ: (Math.random() - 0.5) * 0.2,
      });
    }
    return positions;
  }, [cards.length]);

  return (
    <>
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#6366f1" transparent opacity={0.12} wireframe />
      </Sphere>
      <Sphere args={[12, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0284c7" transparent opacity={0.06} wireframe />
      </Sphere>
      <Sphere args={[16, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.04} wireframe />
      </Sphere>
      <Sphere args={[20, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.03} wireframe />
      </Sphere>

      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={cardPositions[i]} />
      ))}
    </>
  );
}

/* =========================
   Page/Component Export
   ========================= */

interface ParticleSphereBackgroundProps {
  centerX?: number;
  centerY?: number;
  radius?: number;
  activeView: string | null;
  setActiveView: (view: string | null) => void;
  setActiveFunctionId?: (id: string | null) => void;
  scrollProgress?: number;
}

export default function ParticleSphereBackground({
  activeView,
  setActiveView,
  setActiveFunctionId,
  scrollProgress = 0,
}: ParticleSphereBackgroundProps) {
  // Cinematic zoom out: scale from 1.15 down to 0.85
  const currentScale = 1.15 - scrollProgress * 0.30;

  return (
    <CardProvider activeView={activeView} setActiveView={setActiveView} setActiveFunctionId={setActiveFunctionId}>
      <div className="fixed inset-0 z-[1] bg-[#030712] overflow-hidden pointer-events-none flex items-center justify-center select-none">
        
        {/* Atmospheric Background Ambient Glow behind the sphere */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.12),transparent_75%)] blur-3xl pointer-events-none transition-all duration-700" 
          style={{ opacity: 1 - scrollProgress * 0.4 }}
        />
        
        {/* Grounding Shadow mimicking a real contact light falloff */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-6 bg-teal-950/40 rounded-full blur-xl pointer-events-none border-t border-teal-500/10" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-3 bg-teal-900/30 rounded-full blur-md pointer-events-none" />

        {/* 3D Particle Starfield Interactive Canvas Background */}
        <div 
          className="w-full h-full relative z-[1] transition-transform duration-700 ease-out pointer-events-auto"
          style={{ transform: `scale(${currentScale})` }}
        >
          <StarfieldBackground />
        </div>

        {/* Subtle depth vignette overlay (Pristine visual finish) */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.95)] z-[2]" />

        {/* Modal display when card is clicked */}
        <CardModal setActiveView={setActiveView} />
      </div>
    </CardProvider>
  );
}
