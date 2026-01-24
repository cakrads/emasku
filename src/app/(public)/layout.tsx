import { SimpleNavbar } from '@/frontend/components/fragments/public/simple-navbar'
import { SimpleFooter } from '@/frontend/components/fragments/public/simple-footer'

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
      <SimpleFooter />
    </>
  );
}
