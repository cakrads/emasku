import { SimpleNavbar } from '@/frontend/components/fragments/public/simple-navbar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SimpleNavbar />
      <main className="min-h-screen bg-background">
        {children}
      </main>
    </>
  );
}
