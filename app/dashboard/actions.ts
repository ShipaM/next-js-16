"use server"; // Директива Next.js, указывающая, что этот файл выполняется только на сервере

import { auth } from "@/auth"; // Импортируем функцию auth из модуля аутентификации для получения сессии пользователя
import { prisma } from "@/lib/db"; // Импортируем экземпляр Prisma для работы с базой данных
import { categoryIdToDbType, Component } from "@/lib/types"; // Импортируем типы и утилиты из модуля типов
import { revalidatePath } from "next/cache"; // Импортируем функцию для сброса кэша Next.js после изменений

// Экспортируем тип для состояния формы сохранения сборки
export type SaveBuildFromState = {
  status: "idle" | "success" | "error"; // Статус операции: бездействие, успех или ошибка
  message?: string; // Необязательное сообщение с результатом операции
};

// Экспортируем асинхронную функцию для сохранения сборки, принимающую предыдущее состояние и FormData
export async function saveBuildAction(
  _prevState: SaveBuildFromState, // Предыдущее состояние формы (используется useActionState)
  formData: FormData, // Данные формы от клиента
): Promise<SaveBuildFromState> {
  // Возвращаем промис с состоянием формы
  const name = String(formData.get("name") ?? "").trim(); // Получаем имя сборки из FormData, преобразуем в строку и удаляем пробелы
  const componentIds = String(formData.get("componentIds")) // Получаем строку с ID компонентов
    .split(",") // Разделяем строку по запятой на массив
    .map((id) => id.trim()) // Удаляем пробелы вокруг каждого ID
    .filter(Boolean); // Удаляем пустые значения из массива

  const result = await saveBuild(name, componentIds); // Вызываем функцию saveBuild для сохранения данных

  if (!result.success) {
    // Если сохранение не удалось
    return {
      status: "error", // Устанавливаем статус ошибки
      message: result.error, // Возвращаем сообщение об ошибке
    };
  }

  return {
    status: "success", // Устанавливаем статус успеха
    message: "Build saved successfully", // Возвращаем сообщение об успешном сохранении
  };
}

// Экспортируем функцию для сохранения сборки в базе данных
export async function saveBuild(
  name: string, // Имя сборки
  componentIds: string[], // Массив ID компонентов
): Promise<
  { success: true; buildId: string } | { success: false; error: string } // Возвращаем либо успех с ID, либо ошибку
> {
  const session = await auth(); // Получаем текущую сессию пользователя

  if (!session?.user.id) {
    // Если сессия отсутствует или нет ID пользователя
    return { success: false, error: "Not authenticated" }; // Возвращаем ошибку аутентификации
  }

  const trimmedName = name.trim(); // Удаляем ведущие и замыкающие пробелы из имени

  if (!trimmedName) {
    // Если имя пустое после обрезки
    return { success: false, error: "Enter" }; // Возвращаем ошибку
  }

  if (componentIds.length === 0) {
    // Если массив компонентов пуст
    return { success: false, error: "Select at least one component" }; // Возвращаем ошибку
  }

  // Получаем компоненты из базы данных по их ID через Prisma
  const components = await prisma.component.findMany({
    where: { id: { in: componentIds } }, // Фильтр: ищем все компоненты с ID из массива
  });

  if (components.length !== componentIds.length) {
    // Если найдено меньше компонентов, чем запрошено
    return { success: false, error: "Invalid components" }; // Возвращаем ошибку невалидных компонентов
  }

  const totalPrice = components.reduce((s, c) => s + c.price, 0); // Вычисляем общую сумму, суммируя цены всех компонентов

  try {
    // Начинаем блок обработки транзакции
    // Выполняем транзакцию для атомарного создания сборки и связей
    const build = await prisma.$transaction(async (tx) => {
      // Создаем новую запись сборки в базе данных
      const newBuild = await tx.build.create({
        data: {
          name: trimmedName, // Устанавливаем имя сборки
          totalPrice, // Устанавливаем общую цену
          userId: session.user.id, // Привязываем сборку к текущему пользователю
        },
      });

      // Создаем записи связей между сборкой и компонентами
      await tx.buildComponent.createMany({
        data: componentIds.map((componentId) => ({
          // Для каждого ID компонента создаем запись связи
          buildId: newBuild.id, // ID созданной сборки
          componentId, // ID компонента
        })),
      });

      return newBuild; // Возвращаем созданную сборку
    });

    revalidatePath("/dashboard"); // Сбрасываем кэш для страницы dashboard
    revalidatePath("/builds"); // Сбрасываем кэш для страницы builds

    return { success: true, buildId: build.id }; // Возвращаем успех и ID созданной сборки
  } catch (error) {
    // Ловим исключения при сохранении
    return { success: false, error: "Something went wrong" }; // Возвращаем общую ошибку
  }
}

// Экспортируем функцию для получения компонентов по категории
export async function getComponentsByCategory(
  categoryId: string, // ID категории компонентов
): Promise<Component[]> {
  // Возвращаем промис с массивом компонентов
  const dbType = categoryIdToDbType[categoryId]; // Преобразуем ID категории в тип базы данных
  if (!dbType) return [] as Component[]; // Если тип не найден, возвращаем пустой массив

  // Получаем компоненты из базы данных через Prisma
  const components = await prisma.component.findMany({
    where: { type: dbType }, // Фильтр: ищем компоненты по типу
    orderBy: { price: "asc" }, // Сортируем по цене по возрастанию
  });
  // Преобразуем результаты в формат Component и возвращаем
  return components.map((component) => ({
    id: component.id, // ID компонента
    name: component.name, // Имя компонента
    price: component.price, // Цена компонента
    type: component.type, // Тип компонента
    socket: component.socket, // Сокет компонента
  }));
}
