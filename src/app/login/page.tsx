import { ShieldCheck, Sparkles } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-orange-50 via-white to-amber-50 px-4 py-10 sm:px-6">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] top-[12%] h-24 w-24 rounded-full border border-orange-200/60"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
            <ShieldCheck size={34} strokeWidth={1.8} />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-700 shadow-sm">
            <Sparkles size={14} />
            ADMINISTRATOR AREA
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            SBW <span className="text-orange-600">Digital</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Masuk ke dashboard untuk mengelola konten dan informasi SBW.
          </p>
        </div>

        {/* Login card */}
        <section className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-orange-950/5 ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-slate-900">
              Selamat datang kembali
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Silakan masukkan email dan password akun administrator kamu.
            </p>
          </div>

          <LoginForm />

          <div className="mt-7 border-t border-slate-100 pt-5">
            <p className="text-center text-xs leading-5 text-slate-400">
              <ShieldCheck
                className="mr-1 inline-block align-[-3px]"
                size={14}
              />
              Akses terbatas untuk administrator yang berwenang.
            </p>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SBW Digital
        </p>
      </div>
    </main>
  );
}