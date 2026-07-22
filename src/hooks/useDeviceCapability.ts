import { useState, useEffect } from "react";

export interface DeviceCapability {
  isMobile: boolean;
  isLowPowerDevice: boolean;
  prefersReducedMotion: boolean;
  devicePixelRatio: number;
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(() => {
    const isMobile = typeof window !== "undefined" 
      ? window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      : false;
    const prefersReducedMotion = typeof window !== "undefined" 
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
      : false;
    const hardwareConcurrency = typeof navigator !== "undefined" ? (navigator.hardwareConcurrency || 4) : 4;
    const isLowPowerDevice = isMobile || hardwareConcurrency <= 4;
    const dpr = typeof window !== "undefined" 
      ? Math.min(window.devicePixelRatio || 1, isLowPowerDevice ? 1.25 : 2) 
      : 1;

    return {
      isMobile,
      isLowPowerDevice,
      prefersReducedMotion,
      devicePixelRatio: dpr
    };
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const isLowPower = isMobile || hardwareConcurrency <= 4;
      const dpr = Math.min(window.devicePixelRatio || 1, isLowPower ? 1.25 : 2);

      setCapability({
        isMobile,
        isLowPowerDevice: isLowPower,
        prefersReducedMotion,
        devicePixelRatio: dpr
      });
    };

    window.addEventListener("resize", checkCapabilities);
    return () => window.removeEventListener("resize", checkCapabilities);
  }, []);

  return capability;
}
