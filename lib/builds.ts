import { prisma } from "./db";

export async function getMyBuilds(userId: string) {
  // Возвращаем результат запроса к базе данных через Prisma клиент
  return prisma.build.findMany({
    // Фильтруем сборки по ID пользователя (где userId равен переданному значению)
    where: { userId },
    // Сортируем результаты по дате создания в порядке убывания (новые сначала)
    orderBy: { createdAt: "desc" },
    // Включаем связанные данные в ответ
    include: {
      // Включаем данные пользователя, выбирая только поле email
      user: { select: { email: true } },
      // Включаем компоненты сборки
      components: {
        // Внутри компонентов включаем данные о самом компоненте
        include: {
          component: {
            // Выбираем только поля name, type и price из компонента
            select: { name: true, type: true, price: true },
          },
        },
      },
    },
  });
}

export async function getPublicBuild(userId: string) {
  // Возвращаем результат запроса к базе данных через Prisma клиент
  return prisma.build.findMany({
    // Фильтруем только публичные сборки (где isPublic равно true)
    where: { isPublic: true },
    // Сортируем результаты по дате создания в порядке убывания (новые сначала)
    orderBy: { createdAt: "desc" },
    // Включаем связанные данные в ответ
    include: {
      // Включаем данные пользователя, выбирая поля email и name
      user: { select: { email: true, name: true } },
      // Включаем компоненты сборки
      components: {
        // Внутри компонентов включаем данные о самом компоненте
        include: {
          component: {
            // Выбираем только поле name из компонента
            select: { name: true },
          },
        },
      },
      // Включаем количество лайков (агрегация)
      _count: { select: { likes: true } },
      // Включаем информацию о том, лайкнул ли текущий пользователь эту сборку
      likes: { where: { userId }, select: { id: true } },
    },
  });
}

export async function getBuildToEdit(id: string) {
  // Возвращаем результат запроса к базе данных через Prisma клиент
  return await prisma.build.findFirst({
    // Фильтруем по ID сборки (где id равен переданному значению)
    where: { id },
    // Включаем связанные данные в ответ
    include: {
      // Включаем компоненты сборки
      components: {
        // Внутри компонентов включаем все данные о самом компоненте
        include: {
          component: true,
        },
      },
    },
  });
}

export async function getPopularBuild(limit = 3) {
  // Возвращаем результат запроса к базе данных через Prisma клиент
  return prisma.build.findMany({
    // Фильтруем сборки по условиям
    where: {
      // Только публичные сборки (где isPublic равно true)
      isPublic: true,
      // Только сборки у которых есть хотя бы один лайк
      likes: { some: {} },
    },
    // Сортируем по количеству лайков в порядке убывания (самые популярные сначала)
    orderBy: { likes: { _count: "desc" } },
    // Ограничиваем количество возвращаемых записей (по умолчанию 3)
    take: limit,
    // Включаем связанные данные в ответ
    include: {
      // Включаем количество лайков (агрегация)
      _count: { select: { likes: true } },
    },
  });
}
