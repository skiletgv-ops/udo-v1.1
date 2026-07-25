import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  blur = 0,
  inactiveZone = 0.02,
  proximity = 70,
  spread = 40,
  variant = "default",
  glow = true,
  className = "",
  disabled = false,
  movementDuration = 2,
  borderWidth = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const isInsideProximity =
        x >= -proximity &&
        x <= rect.width + proximity &&
        y >= -proximity &&
        y <= rect.height + proximity;

      if (isInsideProximity) {
        setMousePosition({ x, y });
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [disabled, proximity]);

  if (disabled) return null;

  // Gradient colors strictly limited to cyan (#00D4AA / #06b6d4), blue (#3b82f6), and violet (#8b5cf6)
  const gradientColor =
    variant === "white"
      ? "radial-gradient(circle at %X%px %Y%px, rgba(255, 255, 255, 0.4) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 70%)"
      : "radial-gradient(circle at %X%px %Y%px, rgba(0, 212, 170, 0.7) 0%, rgba(59, 130, 246, 0.5) 35%, rgba(139, 92, 246, 0.3) 60%, transparent 80%)";

  const x = mousePosition?.x ?? 0;
  const y = mousePosition?.y ?? 0;
  const currentGradient = gradientColor.replace("%X%", x.toFixed(1)).replace("%Y%", y.toFixed(1));

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute -inset-[1px] rounded-[inherit] overflow-hidden transition-opacity duration-300 ${className}`}
      style={{
        opacity: isHovered || glow ? (isHovered ? 1 : 0.4) : 0,
      }}
    >
      {/* Animated Glowing Gradient Border */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: `${borderWidth}px`,
          background: isHovered
            ? currentGradient
            : "linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(59,130,246,0.15) 50%, rgba(139,92,246,0.15) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      />

      {/* Subtle Glow Backdrop */}
      {isHovered && glow && (
        <div
          className="absolute inset-0 rounded-[inherit] opacity-25 blur-lg transition-opacity duration-300"
          style={{
            background: currentGradient,
          }}
        />
      )}
    </div>
  );
};
