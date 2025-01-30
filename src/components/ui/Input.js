import React from "react";

export const Input = ({
  value,
  onChange,
  placeholder,
  name,
  type = "text",
}) => {
  return (
    <input
      className="rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 "
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
