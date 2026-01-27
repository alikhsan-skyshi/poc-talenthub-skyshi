"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
}) => {
  return (
    <label className="flex items-center cursor-pointer">
      {label && <span className="mr-2 text-sm text-gray-700">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div
          className={`
            block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out
            ${checked ? "bg-green-500" : "bg-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        ></div>
        <div
          className={`
            absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out
            ${checked ? "transform translate-x-6" : "transform translate-x-0"}
          `}
        ></div>
      </div>
    </label>
  );
};
