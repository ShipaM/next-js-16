"use server"; // Директива Next.js, указывающая, что этот файл выполняется только на сервере

import { redirect } from "next/navigation"; // Импортируем функцию для перенаправления пользователя
import { signIn } from "@/auth"; // Импортируем функцию signIn из модуля аутентификации
import { AuthError } from "next-auth"; // Импортируем класс ошибки аутентификации NextAuth

// Экспортируем тип для состояния формы входа
export type LoginState = { error?: string }; // Состояние с необязательным полем ошибки

// Экспортируем асинхронную функцию для входа пользователя
export async function loginAction(
  _prevState: LoginState | null, // Предыдущее состояние формы (используется useActionState)
  formData: FormData, // Данные формы от клиента
): Promise<LoginState> {
  // Возвращаем промис с состоянием входа
  const email = String(formData.get("email")).trim(); // Получаем email из FormData, преобразуем в строку и удаляем пробелы
  const password = String(formData.get("password")).trim(); // Получаем пароль из FormData, преобразуем в строку и удаляем пробелы

  if (!email || !password) {
    // Если email или пароль пустые
    return { error: "Введите email или пароль" }; // Возвращаем ошибку
  }

  try {
    // Начинаем блок обработки ошибок
    console.log("email, ", email, password); // Логируем email и пароль для отладки
    await signIn("credentials", {
      // Вызываем signIn с провайдером credentials
      email, // Передаем email
      password, // Передаем пароль
      redirectTo: "/dashboard", // Указываем путь для перенаправления после успешного входа
    });

    redirect("/dashboard"); // Перенаправляем пользователя на страницу dashboard
  } catch (error) {
    // Ловим исключения при аутентификации
    if (error instanceof AuthError) {
      // Если ошибка является ошибкой аутентификации NextAuth
      if (error.type === "CredentialsSignin") {
        // Если ошибка связана с неверными учетными данными
        return { error: "Неверный email или пароль" }; // Возвращаем соответствующую ошибку
      }

      return { error: "Ошибка авторизации" }; // Возвращаем общую ошибку авторизации
    }

    throw error; // Пробрасываем неизвестную ошибку дальше
  }
}
