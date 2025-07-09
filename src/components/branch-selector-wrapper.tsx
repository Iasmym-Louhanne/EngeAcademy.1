"use client";

import { useAuth } from "@/contexts/auth-context";
import { BranchSelector } from "./branch-selector";

export function BranchSelectorWrapper() {
  const { needsBranchSelection } = useAuth();
  
  if (!needsBranchSelection) {
    return null;
  }
  
  return <BranchSelector />;
}