import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
