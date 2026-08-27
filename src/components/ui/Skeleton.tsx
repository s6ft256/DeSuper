import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  count?: number;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  count = 1,
  animate = true,
}) => {
  const baseClasses = "bg-white/10";
  const animateClass = animate ? "animate-pulse" : "";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || (variant === "circular" ? width || "2.5rem" : undefined),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${variantClasses[variant]} ${animateClass} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 ${className}`}>
    <Skeleton variant="text" width="60%" className="h-5" />
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="80%" />
    <div className="flex gap-2 mt-4">
      <Skeleton variant="rounded" width="5rem" height="2rem" />
      <Skeleton variant="rounded" width="5rem" height="2rem" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 5,
  className = "",
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonProfile: React.FC = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton variant="circular" width="4rem" height="4rem" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="40%" className="h-5" />
      <Skeleton variant="text" width="60%" />
    </div>
  </div>
);
