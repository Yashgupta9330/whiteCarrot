import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", color = "gray" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-4",
    lg: "w-8 h-8 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]}`}
      style={{ borderColor: color }}
    />
  );
};
