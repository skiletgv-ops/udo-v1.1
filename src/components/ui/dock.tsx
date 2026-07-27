'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/src/lib/utils';

const DOCK_HEIGHT = 160;
const DEFAULT_MAGNIFICATION = 160;
const DEFAULT_DISTANCE = 180;
const DEFAULT_PANEL_HEIGHT = 64;

type Orientation = 'horizontal' | 'vertical';

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  panelWidth?: number;
  magnification?: number;
  spring?: SpringOptions;
  orientation?: Orientation;
};
type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
};
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mousePos: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
  orientation: Orientation;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  panelWidth = DEFAULT_PANEL_HEIGHT,
  orientation = 'horizontal',
}: DockProps) {
  const mousePos = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const isVertical = orientation === 'vertical';

  const maxDimension = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const dimensionRow = useTransform(isHovered, [0, 1], [isVertical ? panelWidth : panelHeight, maxDimension]);
  const animatedDimension = useSpring(dimensionRow, spring);

  return (
    <motion.div
      style={
        isVertical
          ? { width: animatedDimension, scrollbarWidth: 'none' }
          : { height: animatedDimension, scrollbarWidth: 'none' }
      }
      className={cn(
        'no-scrollbar',
        isVertical
          ? 'my-2 flex flex-col max-h-full items-start overflow-y-auto'
          : 'mx-2 flex max-w-full items-end overflow-x-auto'
      )}
    >
      <motion.div
        onMouseMove={(e) => {
          isHovered.set(1);
          mousePos.set(isVertical ? e.pageY : e.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mousePos.set(Infinity);
        }}
        className={cn(
          'flex gap-3 rounded-2xl bg-neutral-900/90 border border-white/10 p-2 backdrop-blur-xl shadow-2xl',
          isVertical ? 'flex-col h-fit w-fit' : 'mx-auto w-fit h-fit',
          className
        )}
        style={isVertical ? { width: panelWidth } : { height: panelHeight }}
        role='toolbar'
        aria-label='Application dock'
      >
        <DockProvider value={{ mousePos, spring, distance, magnification, orientation }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, onClick, title }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { distance, magnification, mousePos, spring, orientation } = useDock();
  const isVertical = orientation === 'vertical';

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mousePos, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    if (isVertical) {
      return val - domRect.y - domRect.height / 2;
    }
    return val - domRect.x - domRect.width / 2;
  });

  const dimensionTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [44, magnification, 44]
  );

  const dimension = useSpring(dimensionTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={isVertical ? { height: dimension, width: dimension } : { width: dimension, height: dimension }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      title={title}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer select-none shrink-0',
        className
      )}
      tabIndex={0}
      role='button'
      aria-haspopup='true'
    >
      {Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return cloneElement(child as React.ReactElement<any>, { dimension, isHovered });
      })}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);
  const { orientation } = useDock();
  const isVertical = orientation === 'vertical';

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute w-fit whitespace-pre rounded-lg border border-cyan-500/30 bg-[#0e1017]/95 px-2.5 py-1 text-[11px] font-sans font-bold tracking-wider text-cyan-200 shadow-[0_4px_15px_rgba(0,0,0,0.8)] backdrop-blur-md z-50 pointer-events-none',
            isVertical
              ? 'left-full ml-3 top-1/2 -translate-y-1/2'
              : '-top-10 left-1/2 -translate-x-1/2',
            className
          )}
          role='tooltip'
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const dimension = (restProps['dimension'] || restProps['width']) as MotionValue<number>;

  const iconSizeTransform = useTransform(dimension, (val) => (val ? val * 0.55 : 24));

  return (
    <motion.div
      style={{ width: iconSizeTransform, height: iconSizeTransform }}
      className={cn('flex items-center justify-center text-current', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
