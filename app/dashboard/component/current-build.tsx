"use client";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography-h1";
import type { Component } from "@/lib/types";
import { useCallback, useState, type FC } from "react";
import { TableParts } from "./table-parts";
import { componentCategories } from "@/lib/constants";
import { SaveBuildDialog } from "./save-build-dialog";

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
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 md:mb-8">
        <TypographyH1>Build your collection</TypographyH1>
        <Button onClick={() => setSaveDialogOpen(true)} className="shrink-0">
          Save build
        </Button>
      </div>
      <div className="min-w-0 overflow-x-auto">
        <TableParts
          components={componentCategories}
          onSelectedComponent={onSelectComponent}
          selectedByCategory={selectedByCategory}
        />
        <SaveBuildDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          selectedByCategory={selectedByCategory}
        />
      </div>
    </>
  );
};
