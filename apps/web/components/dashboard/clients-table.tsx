"use client";

import { useState } from "react";
import {
  Zap,
  Leaf,
  Sun,
  Circle,
  Star,
  Sparkles,
  Target,
  Rocket,
  Globe,
  Layers,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Status =
  | "In Negotiation"
  | "Rejected"
  | "Follow-Up Required"
  | "Prospecting"
  | "Under Review"
  | "Accepted";

interface Client {
  id: string;
  name: string;
  icon: "zap" | "check" | "star" | "sparkles";
  company: string;
  companyIcon: React.ReactNode;
  companyColor: string;
  price: string;
  address: string;
  status: Status;
  date: string;
  note: string;
}

const iconMap = {
  zap: Zap,
  check: Leaf,
  star: Star,
  sparkles: Sparkles,
};

const companyIcons = [
  { icon: <Target className="h-4 w-4" />, color: "bg-emerald-500" },
  { icon: <Leaf className="h-4 w-4" />, color: "bg-green-500" },
  { icon: <Circle className="h-4 w-4" />, color: "bg-purple-500" },
  { icon: <Sun className="h-4 w-4" />, color: "bg-yellow-500" },
  { icon: <Globe className="h-4 w-4" />, color: "bg-blue-500" },
  { icon: <Rocket className="h-4 w-4" />, color: "bg-red-500" },
  { icon: <Layers className="h-4 w-4" />, color: "bg-pink-500" },
  { icon: <Sparkles className="h-4 w-4" />, color: "bg-orange-500" },
];

const statusVariants: Record<Status, "info" | "destructive" | "warning" | "purple" | "secondary" | "success"> = {
  "In Negotiation": "info",
  "Rejected": "destructive",
  "Follow-Up Required": "warning",
  "Prospecting": "purple",
  "Under Review": "secondary",
  "Accepted": "success",
};

// Sample data
const clients: Client[] = [
  { id: "1", name: "James Mitchell", icon: "zap", company: "Peregrin", companyIcon: companyIcons[0].icon, companyColor: companyIcons[0].color, price: "$15,900,000", address: "987 Tech Way, Seattle, WA", status: "In Negotiation", date: "12/03/2024", note: "Start implementation" },
  { id: "2", name: "Olivia Bennett", icon: "check", company: "Pollinate", companyIcon: companyIcons[1].icon, companyColor: companyIcons[1].color, price: "$8,500,000", address: "123 Tech Blvd, San Franci...", status: "Rejected", date: "02/02/2024", note: "Reassess and re-approach" },
  { id: "3", name: "Liam Harrison", icon: "zap", company: "Eclipseful", companyIcon: companyIcons[2].icon, companyColor: companyIcons[2].color, price: "$3,000,000", address: "456 Media St, New York,...", status: "Follow-Up Required", date: "21/01/2024", note: "Set up initial meeting" },
  { id: "4", name: "Emma Collins", icon: "check", company: "Solaris Energy", companyIcon: companyIcons[3].icon, companyColor: companyIcons[3].color, price: "$10,000,000", address: "789 Green Ave, Austin, TX", status: "Prospecting", date: "22/04/2024", note: "Discuss collaboratio..." },
  { id: "5", name: "Noah Anderson", icon: "check", company: "Spherule", companyIcon: companyIcons[4].icon, companyColor: companyIcons[4].color, price: "$9,850,000", address: "123 Green Rd, Miami, FL", status: "Under Review", date: "11/02/2024", note: "Negotiate final terms" },
  { id: "6", name: "Sophia Evans", icon: "check", company: "Sisyphus", companyIcon: companyIcons[5].icon, companyColor: companyIcons[5].color, price: "$10,700,000", address: "555 Horizon Way, New Yor...", status: "Prospecting", date: "12/09/2024", note: "Set follow-up meeting" },
  { id: "7", name: "Ethan Turner", icon: "check", company: "Railspeed", companyIcon: companyIcons[6].icon, companyColor: companyIcons[6].color, price: "$4,270,000", address: "111 Infinity Dr, Chicago, IL", status: "Accepted", date: "23/05/2024", note: "Kick-off project" },
  { id: "8", name: "Isabella Foster", icon: "check", company: "Magnolia", companyIcon: companyIcons[7].icon, companyColor: companyIcons[7].color, price: "$12,200,000", address: "666 Nova Ave, San Franci...", status: "Accepted", date: "12/06/2024", note: "Finalize payment schedule" },
  { id: "9", name: "Mason Reed", icon: "zap", company: "Leapyears", companyIcon: companyIcons[2].icon, companyColor: companyIcons[2].color, price: "$51,800,000", address: "222 GreenTech Blvd, Denv...", status: "Under Review", date: "21/03/2024", note: "Negotiate final terms" },
  { id: "10", name: "Mia Sullivan", icon: "zap", company: "Goodwell", companyIcon: companyIcons[4].icon, companyColor: companyIcons[4].color, price: "$25,000,000", address: "333 TechSavvy Ln, Miami,...", status: "Rejected", date: "24/02/2024", note: "Reassess and re-approach" },
  { id: "11", name: "Logan Brooks", icon: "star", company: "Fourpoints", companyIcon: companyIcons[0].icon, companyColor: companyIcons[0].color, price: "$30,500,000", address: "444 Horizon St, Seattle, W...", status: "Follow-Up Required", date: "03/05/2024", note: "Arrange demo presentation" },
  { id: "12", name: "Charlotte Hayes", icon: "zap", company: "Flora&Fauna", companyIcon: companyIcons[5].icon, companyColor: companyIcons[5].color, price: "$22,800,000", address: "999 UrbanTech Rd, Austin,...", status: "In Negotiation", date: "04/09/2024", note: "Send contract for review" },
  { id: "13", name: "Benjamin Wallace", icon: "sparkles", company: "Synergy", companyIcon: companyIcons[1].icon, companyColor: companyIcons[1].color, price: "$5,500,000", address: "222 Horizon Dr, Denver, C...", status: "Under Review", date: "09/06/2024", note: "Send updated proposal" },
  { id: "14", name: "Ava Carter", icon: "zap", company: "Dynamic", companyIcon: companyIcons[3].icon, companyColor: companyIcons[3].color, price: "$12,800,000", address: "789 Sky Blvd, Denver, CO", status: "Accepted", date: "06/10/2024", note: "Finalize agreement" },
  { id: "15", name: "Alexander Parker", icon: "star", company: "Ascend", companyIcon: companyIcons[4].icon, companyColor: companyIcons[4].color, price: "$5,000,000", address: "234 Tech St, San Francisc...", status: "Follow-Up Required", date: "08/11/2024", note: "Arrange intro meeting" },
];

export function ClientsTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["2", "4", "5"]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === clients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(clients.map((c) => c.id));
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-background">
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="w-12 p-4">
              <Checkbox
                checked={selectedIds.length === clients.length}
                onCheckedChange={toggleSelectAll}
              />
            </th>
            <th className="p-4 font-medium">Client Name</th>
            <th className="p-4 font-medium">Company</th>
            <th className="p-4 font-medium">Listed Price</th>
            <th className="p-4 font-medium">Address</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const IconComponent = iconMap[client.icon];
            return (
              <tr
                key={client.id}
                className={cn(
                  "border-b border-border text-sm transition-colors hover:bg-muted/50",
                  selectedIds.includes(client.id) && "bg-muted/30"
                )}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedIds.includes(client.id)}
                    onCheckedChange={() => toggleSelect(client.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded text-yellow-500">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">
                      {client.name}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Avatar className={cn("h-6 w-6", client.companyColor)}>
                      <AvatarFallback className={cn("text-white", client.companyColor)}>
                        {client.companyIcon}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{client.company}</span>
                  </div>
                </td>
                <td className="p-4 text-foreground">{client.price}</td>
                <td className="p-4 text-muted-foreground">{client.address}</td>
                <td className="p-4">
                  <Badge variant={statusVariants[client.status]}>
                    {client.status}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground">{client.date}</td>
                <td className="p-4 text-muted-foreground">{client.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
