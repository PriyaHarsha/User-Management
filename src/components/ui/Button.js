import PropTypes from "prop-types";
import React from "react";
import { classNames } from "../../utils/classname";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled = false,
  className,
}) => {
  const baseStyles =
    "px-4 py-2 font-medium rounded-2xl focus:outline-none transition-all";

  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        baseStyles,
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["default", "destructive", "outline"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
