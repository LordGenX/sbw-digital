"use client";

import { useActionState } from "react";

import { login } from "@/actions/auth.actions";

type LoginState = {
  success: boolean;
  message: string;
};

const initialState: LoginState = {
  success: false,
  message: "",
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    login,
    initialState,
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="admin@sbw-digital.local"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Memproses..." : "Login"}
      </button>

      {state.message && (
        <p>{state.message}</p>
      )}
    </form>
  );
}