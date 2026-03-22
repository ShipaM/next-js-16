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
  Pencil,
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

const iconLabels: Record<string, string> = {
  Cpu: "CPU",
  Monitor: "Monitor",
  Server: "Case",
  MemoryStick: "RAM",
  HardDrive: "Storage",
  Zap: "PSU",
  Box: "Motherboard",
  Fan: "Cooling",
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
          <TableHead className="w-[50px] sm:w-[100px]">Component</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="max-w-[120px] sm:max-w-none truncate">
            Model
          </TableHead>
          <TableHead className="hidden md:table-cell">Price</TableHead>
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
                <div
                  className="flex items-center"
                  title={iconLabels[category.icon]}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell font-bold">
                {category.name}
              </TableCell>
              <TableCell
                className="font-medium max-w-[120px] sm:max-w-none truncate"
                title={selected?.name}
              >
                {selected?.name ?? "-"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {selected?.price ?? "-"}
              </TableCell>
              <TableCell className="text-right">
                <Dialog
                  open={openCategoryId === category.id}
                  onOpenChange={(open) =>
                    setOpenCategoryId(open ? category.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 sm:px-3 flex items-center gap-2"
                    >
                      <span>
                        {selected ? (
                          <Pencil className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                      <span className="hidden sm:inline">
                        {selected ? "Edit" : "Add"}
                      </span>
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
            <p className="font-large text-gray-500">
              {new Intl.NumberFormat("en-EN").format(totalPrice)}
            </p>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
