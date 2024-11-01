import Protected from "@/components/protected";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <Protected>{children}</Protected>;
}
