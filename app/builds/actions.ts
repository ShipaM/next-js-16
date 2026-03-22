"use server"; // Директива Next.js, указывающая, что этот файл выполняется только на сервере

import { auth } from "@/auth"; // Импортируем функцию auth из модуля аутентификации для получения сессии пользователя
import { prisma } from "@/lib/db"; // Импортируем экземпляр Prisma для работы с базой данных
import { revalidatePath } from "next/cache"; // Импортируем функцию для сброса кэша Next.js после изменений

// Экспортируем асинхронную функцию для установки публичности сборки
export async function setBuildPublicAction(formData: FormData) {
  const session = await auth(); // Получаем текущую сессию пользователя через auth()

  if (!session?.user.id) return; // Если сессия отсутствует или нет ID пользователя, прекращаем выполнение

  const buildId = String(formData.get("buildId")) ?? ""; // Получаем ID сборки из FormData и преобразуем в строку
  const isPublic = formData.get("isPublic") === "true"; // Получаем значение isPublic и проверяем, равно ли оно "true"

  if (!buildId) return; // Если ID сборки пустой, прекращаем выполнение

  // Обновляем запись сборки в базе данных через Prisma
  await prisma.build.updateMany({
    where: { id: buildId, userId: session?.user.id }, // Фильтр: ищем сборку по ID и ID пользователя для безопасности
    data: { isPublic }, // Устанавливаем новое значение isPublic
  });

  revalidatePath("/dashboard"); // Сбрасываем кэш для страницы dashboard, чтобы отобразить изменения
  revalidatePath("/builds/explore"); // Сбрасываем кэш для страницы explore, чтобы отобразить изменения
}

export async function deleteBuildAction(formData: FormData) {
  const session = await auth(); // Получаем текущую сессию пользователя через auth()

  if (!session?.user.id) return; // Если сессия отсутствует или нет ID пользователя, прекращаем выполнение

  const buildId = String(formData.get("buildId")) ?? ""; // Получаем ID сборки из FormData и преобразуем в строку

  if (!buildId) return; // Если ID сборки пустой, прекращаем выполнение

  await prisma.build.deleteMany({
    where: { id: buildId, userId: session?.user.id },
  }); // Удаляем сборку по ID с помощью Prisma

  revalidatePath("/builds"); // Сбрасываем кэш для страницы dashboard, чтобы отобразить изменения
}

export async function toggleLikeAction(formData: FormData) {
  const session = await auth(); // Получаем текущую сессию пользователя через auth()

  if (!session?.user.id) return; // Если сессия отсутствует или нет ID пользователя, прекращаем выполнение

  const buildId = String(formData.get("buildId")) ?? ""; // Получаем ID сборки из FormData и преобразуем в строку

  if (!buildId) return; // Если ID сборки пустой, прекращаем выполнение

  const build = await prisma.build.findUnique({
    where: { id: buildId },
    select: { isPublic: true },
  });

  if (!build?.isPublic) return; // Если сборка не найдена, прекращаем выполнение

  const existing = await prisma.like.findUnique({
    where: { userId_buildId: { userId: session?.user.id, buildId } }, // Ищем лайк по ID сборки и ID пользователя
  });

  if (existing) {
    await prisma.like.delete({
      where: { id: existing.id }, // Удаляем лайк по ID сборки и ID пользователя
    }); // Удаляем лайк по ID сборки и ID пользователя
  } else {
    await prisma.like.create({
      data: { userId: session?.user.id, buildId }, // Создаем новый лайк с ID сборки и ID пользователя
    }); // Создаем новый лайк с ID сборки и ID пользователя
  }

  revalidatePath("/builds"); // Сбрасываем кэш для страницы builds, чтобы отобразить изменения
  revalidatePath("/dashboard"); // Сбрасываем кэш для страницы dashboard, чтобы отобразить изменения
  revalidatePath("/builds/explore"); // Сбрасываем кэш для страницы explore, чтобы отобразить изменения
}
