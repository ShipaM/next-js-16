"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Component, ComponentCategory } from "@/lib/types";
import {
  Box,
  Cpu,
  Fan,
  HardDrive,
  MemoryStick,
  Monitor,
  Plus,
  Server,
  Zap,
} from "lucide-react";
import { FC, useState } from "react";
import { AddComponentDialogContent } from "./add-component-dialog";

const iconMap: Record<ComponentCategory["icon"], React.ElementType> = {
  Cpu,
  Monitor,
  Server,
  MemoryStick,
  HardDrive,
  Zap,
  Box,
  Fan,
};

type CategoryRow = {
  id: string;
  name: string;
  icon: string;
};

type TablePartsProps = {
  components: CategoryRow[];
  selectedByCategory: Record<string, Component | null>;
  onSelectedComponent: (
    categoryId: string,
    component: Component | null,
  ) => void;
};

export const TableParts: FC<TablePartsProps> = ({
  components,
  selectedByCategory,
  onSelectedComponent,
}) => {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const totalPrice = Object.values(selectedByCategory).reduce(
    (acc, component) => (component ? acc + component.price : acc),
    0,
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Component</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {components.map((category) => {
          const Icon = iconMap[category.icon];
          const selected = selectedByCategory[category.id];

          return (
            <TableRow key={category.id} className="my-2">
              <TableCell>
                <div className="flex tems-center">
                  <Icon className="h-5 w-5 mr-1" />
                </div>
              </TableCell>
              <TableCell className="font-bold">{category.name}</TableCell>
              <TableCell>{selected?.name ?? "-"}</TableCell>
              <TableCell>{selected?.price ?? "-"}</TableCell>
              <TableCell className="text-right">
                <Dialog
                  open={openCategoryId === category.id}
                  onOpenChange={(open) =>
                    setOpenCategoryId(open ? category.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      {selected ? "Edit" : "Add"}
                    </Button>
                  </DialogTrigger>
                  <AddComponentDialogContent
                    categoryId={category.id}
                    categoryName={category.name}
                    onSelect={(c) => {
                      onSelectedComponent(category.id, c);
                      setOpenCategoryId(null);
                    }}
                  />
                </Dialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>
            <p className="font-medium">Price:</p>
            <p className="font-large text-gray500">
              {new Intl.NumberFormat("en-En").format(totalPrice)}
            </p>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
