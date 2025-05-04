"use client";

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-300';
  const variantStyles =
    variant === 'primary'
      ? 'bg-primary text-white hover:secondary hover:shadow-lg'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md';

  return (
    <button className={`${baseStyles} ${variantStyles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;