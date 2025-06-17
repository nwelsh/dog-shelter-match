import "./Button.scss";

import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
  className?: string;
}

const Button = ({
  variant = "primary",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`btn btn--${variant} `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
