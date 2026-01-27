import React from "react";

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = "",
}) => {
  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      {children}
    </form>
  );
};
