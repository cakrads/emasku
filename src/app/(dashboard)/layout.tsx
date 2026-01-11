import { Navbar } from "@/frontend/components/fragments/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen pb-16 md:pb-0 md:pt-16">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
