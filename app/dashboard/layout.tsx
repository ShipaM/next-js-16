export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto mt-4 px-4 sm:mt-6 md:mt-8">
      {children}
    </div>
  );
}
