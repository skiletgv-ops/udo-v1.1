import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isValid?: boolean;
  isInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isValid, isInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/10 bg-[#111217]/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500",
          "transition-all duration-300 outline-none focus-visible:outline-none",
          "focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:shadow-[0_0_15px_rgba(0,212,170,0.3)]",
          isValid && "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50",
          isInvalid && "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
