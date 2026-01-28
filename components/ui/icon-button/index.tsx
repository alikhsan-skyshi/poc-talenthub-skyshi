"use client";

import React from "react";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "info";
  size?: "sm" | "md";
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "secondary",
  size = "md",
  tooltip,
  className = "",
  ...props
}) => {
  const variantStyles = {
    primary: "text-primary hover:bg-primary-50 hover:text-primary-700",
    secondary: "text-gray-600 hover:bg-light hover:text-gray-700",
    danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
    info: "text-green-600 hover:bg-green-50 hover:text-green-700",
  };

  const sizeStyles = {
    sm: "h-8 w-8 p-1.5",
    md: "h-10 w-10 p-2",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md transition-colors
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  );
};
