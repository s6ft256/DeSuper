import React from "react";
import { Skeleton } from "./Skeleton";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30",
  secondary: "bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-700",
  danger: "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30",
  ghost: "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  variant = "primary",
  size = "md",
  children,
  disabled,
  className = "",
  ...props
}) => (
  <button
    className={`rounded-lg border transition-colors font-mono cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    disabled={isLoading || disabled}
    {...props}
  >
    {isLoading && (
      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )}
    <span>{isLoading && loadingText ? loadingText : children}</span>
  </button>
);

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "green" | "amber" | "purple" | "red";
  className?: string;
}

const colorClasses = {
  cyan: "bg-cyan-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
};

const heightClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  size = "md",
  color = "cyan",
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs font-mono text-slate-400">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-mono text-slate-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

const badgeVariants = {
  default: "bg-slate-700/50 text-slate-300 border-slate-600",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  error: "bg-red-500/20 text-red-300 border-red-500/40",
  info: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border font-mono ${badgeVariants[variant]} ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"} ${className}`}
  >
    {children}
  </span>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  onClick,
}) => (
  <div
    className={`rounded-xl bg-white/5 border border-white/10 p-4 ${hover ? "hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer" : ""} ${className}`}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {children}
  </div>
);

export const LoadingSpinner: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizeClasses = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div
      className={`${sizeClasses[size]} border-2 border-cyan-500 border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}> = ({ isLoading, message = "Loading...", children }) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10 rounded-xl">
        <LoadingSpinner size="md" />
        <span className="text-sm font-mono text-slate-300">{message}</span>
      </div>
    )}
  </div>
);
