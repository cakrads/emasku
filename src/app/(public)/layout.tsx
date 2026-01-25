import { SharedNavbar } from '@/frontend/components/layout/shared-navbar'
import { SimpleFooter } from '@/frontend/components/fragments/public/simple-footer'

export default function PublicLayout({
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
      <SimpleFooter />
    </>
  );
}
