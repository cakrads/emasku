import { SharedNavbar } from '@/frontend/components/layout/shared-navbar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SharedNavbar />
      <main className="min-h-screen bg-background pt-16">
        {children}
      </main>
    </>
  );
}
