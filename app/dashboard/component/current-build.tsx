"use client";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography-h1";
import type { Component } from "@/lib/types";
import { useCallback, useState, type FC } from "react";
import { TableParts } from "./table-parts";
import { componentCategories } from "@/lib/constants";

export const CurrentBuild: FC = () => {
  const [selectedByCategory, setSelecetedByCategory] = useState<
    Record<string, Component | null>
  >({});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const onSelectComponent = useCallback(
    (categoryId: string, component: Component | null) => {
      setSelecetedByCategory((prev) => ({
        ...prev,
        [categoryId]: component,
      }));
    },
    [],
  );
  return (
    <>
      <div className="flex justify-between mb-8">
        <TypographyH1>Build your collection</TypographyH1>
        <Button onClick={() => setSaveDialogOpen(true)}>Save build</Button>
      </div>
      <div className="min-w-0 overflow-x-auto">
        <TableParts
          components={componentCategories}
          onSelectedComponent={onSelectComponent}
          selectedByCategory={selectedByCategory}
        />
      </div>
    </>
  );
};
