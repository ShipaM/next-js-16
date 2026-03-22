"use server"; // Директива Next.js, указывающая, что этот файл выполняется только на сервере

import { redirect } from "next/navigation"; // Импортируем функцию для перенаправления пользователя
import { prisma } from "@/lib/db"; // Импортируем экземпляр Prisma для работы с базой данных
import bcrypt from "bcryptjs"; // Импортируем библиотеку для хеширования паролей

const MIN_PASSWORD_LENGHT = 8; // Константа минимальной длины пароля (8 символов)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Регулярное выражение для проверки формата email

// Экспортируем тип для состояния формы регистрации
export type SignupState = { error?: string }; // Состояние с необязательным полем ошибки

// Экспортируем асинхронную функцию для регистрации пользователя
export async function signupAction(
  _prevState: SignupState | null, // Предыдущее состояние формы (используется useActionState)
  formData: FormData, // Данные формы от клиента
): Promise<SignupState> {
  // Возвращаем промис с состоянием регистрации
  const name = formData.get("name") as string | undefined; // Получаем имя из FormData
  const email = formData.get("email") as string | undefined; // Получаем email из FormData
  const password = formData.get("password") as string | undefined; // Получаем пароль из FormData

  console.log("name", name, email, password); // Логируем данные для отладки

  if (!email) {
    // Если email не предоставлен
    return { error: "Enter email" }; // Возвращаем ошибку
  }

  if (!EMAIL_REGEX.test(email)) {
    // Если email не соответствует регулярному выражению
    return { error: "Invalid email" }; // Возвращаем ошибку невалидного email
  }

  if (!password || password.length < MIN_PASSWORD_LENGHT) {
    // Если пароль пустой или короче минимальной длины
    return { error: "Password must be at least 8 characters" }; // Возвращаем ошибку
  }

  // Проверяем существование пользователя с таким email в базе данных
  const existing = await prisma.user.findUnique({
    where: { email }, // Ищем пользователя по email
  });

  if (existing) {
    // Если пользователь с таким email уже существует
    return { error: "Email already exists" }; // Возвращаем ошибку
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль с bcrypt (10 раундов соли)

  // Создаем нового пользователя в базе данных через Prisma
  await prisma.user.create({
    data: {
      email, // Устанавливаем email пользователя
      name, // Устанавливаем имя пользователя
      password: hashedPassword, // Устанавливаем хешированный пароль
    },
  });

  redirect("/login"); // Перенаправляем пользователя на страницу входа после успешной регистрации
}
