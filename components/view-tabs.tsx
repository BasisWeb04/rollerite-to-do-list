"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type View = "active" | "archive";

type ViewTabsProps = {
  view: View;
  onViewChange: (view: View) => void;
  activeCount: number;
  archivedCount: number;
};

export function ViewTabs({
  view,
  onViewChange,
  activeCount,
  archivedCount,
}: ViewTabsProps) {
  return (
    <Tabs
      value={view}
      onValueChange={(v) => onViewChange(v as View)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
        <TabsTrigger value="archive">Archive ({archivedCount})</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
