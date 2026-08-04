import React from "react";
export default function Container({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        ${className}
      `}
    >
      {children}
    </div>
  );
}
