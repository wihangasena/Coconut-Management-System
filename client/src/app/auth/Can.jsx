import React from "react";
import { useAuth } from "./AuthContext.jsx";

/**
 * Component to wrap UI elements that should only be visible to specific roles.
 */
export function Can({ roles, children, fallback = null }) {
  const { user } = useAuth();
  
  if (!user || !roles.includes(user.role)) {
    return fallback;
  }
  
  return <>{children}</>;
}
