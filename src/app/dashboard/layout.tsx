import { ReactNode } from "react";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}