"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

type LoginState = {
  success: boolean;
  message: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan password wajib diisi.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });

    return {
      success: true,
      message: "Login berhasil.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Email atau password salah.",
      };
    }

    throw error;
  }
}

export async function logout() {
  await signOut({
    redirectTo: "/login",
  });
}