import { Header } from "@/components/dashboard/header";
import { Toolbar } from "@/components/dashboard/toolbar";
import { ClientsTable } from "@/components/dashboard/clients-table";

export default function ClientsPage() {
  return (
    <>
      <Header
        breadcrumb={[
          { name: "Data", href: "/dashboard" },
          { name: "Business Partner CRM", href: "/dashboard/clients" },
        ]}
      />
      <Toolbar selectedCount={3} totalResults={120} />
      <ClientsTable />
    </>
  );
}
