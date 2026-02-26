import { Header } from "@/components/dashboard/header";

export default function DashboardPage() {
  return (
    <>
      <Header breadcrumb={[{ name: "Dashboard", href: "/dashboard" }]} />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to Project Manager
          </h1>
          <p className="mt-2 text-muted-foreground">
            Select an option from the sidebar to get started
          </p>
        </div>
      </div>
    </>
  );
}
