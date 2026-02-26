"use client";

import { Search, Bell, Share2, Home, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  breadcrumb?: { name: string; href: string }[];
  title?: string;
}

export function Header({ breadcrumb = [], title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Home className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Home</span>
        {breadcrumb.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span
              className={
                index === breadcrumb.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for documen or files"
            className="w-64 pl-9"
          />
        </div>

        {/* User Avatars */}
        <div className="flex -space-x-2">
          {["bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500"].map(
            (color, i) => (
              <Avatar key={i} className="h-8 w-8 border-2 border-background">
                <AvatarFallback className={color}>
                  {String.fromCharCode(65 + i)}
                </AvatarFallback>
              </Avatar>
            )
          )}
        </div>

        {/* Action Buttons */}
        <Button variant="ghost" size="icon">
          <span className="sr-only">Add</span>
          <span className="text-lg">+</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  );
}
