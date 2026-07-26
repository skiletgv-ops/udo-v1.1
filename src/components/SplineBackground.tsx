'use client'

import React from 'react';
import { SplineScene } from "./ui/splite";

export function SplineBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020813] overflow-hidden pointer-events-none">
      {/* Full screen full zoom 3D Spline Canvas */}
      <div className="absolute inset-0 w-full h-full scale-105 md:scale-125 transition-transform duration-1000 flex items-center justify-center">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full object-cover pointer-events-auto"
        />
      </div>

      {/* Subtle depth vignette overlay for high visual legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020813]/60 via-[#020813]/25 to-[#020813]/70 pointer-events-none" />
    </div>
  );
}

export default SplineBackground;
