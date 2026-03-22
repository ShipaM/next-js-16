"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Component } from "@/lib/types";
import { FC, useEffect, useState } from "react";
import { ComponentCard } from "./component-card";
import { getComponentsByCategory } from "../actions";

type AddComponentDialogContentProps = {
  categoryId: string;
  categoryName: string;
  onSelect: (component: Component) => void;
};

export const AddComponentDialogContent: FC<AddComponentDialogContentProps> = ({
  categoryId,
  categoryName,
  onSelect,
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComponentsByCategory(categoryId).then((data) => {
      setComponents(data);
      setLoading(false);
    });
  }, [categoryId]);

  return (
    <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl w-[90vw] max-h-[80vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-base sm:text-lg">
          Add component - {categoryName}
        </DialogTitle>
      </DialogHeader>
      <div className="overflow-y-auto flex-1 mx-1 px-1">
        {components.length > 0 ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((component: Component) => (
              <ComponentCard
                key={component.id}
                name={component.name}
                price={component.price}
                onClick={() => onSelect(component)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm py-4">
            {loading ? "Loading..." : "No components found"}
          </p>
        )}
      </div>
    </DialogContent>
  );
};
