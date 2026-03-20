"use server";

import { prisma } from "@/lib/db";
import { categoryIdToDbType, Component } from "@/lib/types";

export async function getComponentsByCategory(
  categoryId: string,
): Promise<Component[]> {
  const dbType = categoryIdToDbType[categoryId];
  if (!dbType) return [] as Component[];

  const components = await prisma.component.findMany({
    where: { type: dbType },
    orderBy: { price: "asc" },
  });
  return components.map((component) => ({
    id: component.id,
    name: component.name,
    price: component.price,
    type: component.type,
    socket: component.socket,
  }));
}
