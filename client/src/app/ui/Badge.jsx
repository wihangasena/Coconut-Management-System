import React from "react";

export function Badge({ tone = "neutral", children }) {
  return (
    <span className={`badge ${tone}`}>
      <span className="dot" />
      <span>{children}</span>
    </span>
  );
}
