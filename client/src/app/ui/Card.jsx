import React from "react";

export function Card({ title, action, children, className = "" }) {
  return (
    <div className={`card ${className}`.trim()}>
      {(title || action) && (
        <div className="cardHeader">
          <div className="cardTitle">{title}</div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
