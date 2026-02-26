"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Filter,
  ArrowUpDown,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolbarProps {
  selectedCount?: number;
  totalResults?: number;
  onAddNew?: () => void;
  addNewHref?: string;
  addNewLabel?: string;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
}

export function Toolbar({
  selectedCount = 0,
  totalResults,
  onAddNew,
  addNewHref,
  addNewLabel = "Add new",
  onSearch,
  onRefresh,
}: ToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
      {/* Left Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Update
        </Button>

        {selectedCount > 0 && (
          <Button variant="secondary" size="sm">
            {selectedCount} Selected
          </Button>
        )}

        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>

        {totalResults !== undefined && (
          <span className="text-sm text-muted-foreground">
            {totalResults} Result{totalResults !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {onSearch && (
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-64 pl-9"
            />
          </form>
        )}

        {addNewHref ? (
          <Button size="sm" className="gap-2" asChild>
            <Link href={addNewHref}>
              <Plus className="h-4 w-4" />
              {addNewLabel}
            </Link>
          </Button>
        ) : onAddNew ? (
          <Button size="sm" className="gap-2" onClick={onAddNew}>
            <Plus className="h-4 w-4" />
            {addNewLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
