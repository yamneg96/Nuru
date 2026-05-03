import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface NuruButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Icon rendered before the label */
  leftIcon?: ReactNode;
  /** Icon rendered after the label */
  rightIcon?: ReactNode;
  /** Button label / children */
  children?: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Style Maps                                                         */
/* ------------------------------------------------------------------ */
const variantStyles: Record<string, string> = {
  primary:
    "bg-brand-primary text-text-on-brand shadow-lg shadow-brand-primary/20 hover:bg-blue-700 focus-visible:ring-brand-primary/40",
  secondary:
    "bg-fill-card border border-stroke-weak text-text-strong hover:bg-secondary focus-visible:ring-stroke-strong/30",
  ghost:
    "bg-transparent text-text-medium hover:bg-secondary/60 focus-visible:ring-stroke-strong/20",
  danger:
    "bg-state-danger text-text-on-brand shadow-lg shadow-state-danger/20 hover:bg-red-700 focus-visible:ring-state-danger/40",
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export const NuruButton = forwardRef<HTMLButtonElement, NuruButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref as any}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none select-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...(rest as any)}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  },
);

NuruButton.displayName = "NuruButton";
