import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gift,
  MessageCircle,
  UsersRound,
  Wallet,
} from "lucide-react";
import ScrollReveal from "@/components/public/ScrollReveal";

const benefits = [
  {
    title: "Simpan Pinjam Ringan",
    description: "Bunga bersahabat, proses mudah dan aman.",
    icon: Wallet,
  },
  {
    title: "Pelatihan & Pendampingan",
    description: "Tingkatkan keterampilan dan usaha Anda.",
    icon: BookOpen,
  },
  {
    title: "SHU Setiap Tahun",
    description: "Nikmati bagi hasil dari kebersamaan.",
    icon: Gift,
  },
  {
    title: "Komunitas Saling Mendukung",
    description: "Jaringan perempuan yang berdaya.",
    icon: UsersRound,
  },
];

const joiningSteps = [
  "Hubungi agen SBW",
  "Konsultasi kebutuhan Anda",
  "Resmi menjadi anggota",
];

export default function MembershipBenefitsSection() {
  return (
    <section
      id="keanggotaan"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="relative mx-auto max-w-370 overflow-hidden rounded-[28px] bg-linear-to-br from-orange-500 via-orange-500 to-orange-600 px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-12">
        {/* Dekorasi latar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-orange-300/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/4 h-52 w-52 rounded-full bg-orange-400/20"
        />

        <div className="relative z-10">
          {/* Judul */}
          <ScrollReveal direction="up">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
              <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-orange-600 shadow-sm">
                Keanggotaan
              </span>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Mengapa menjadi anggota SBW?
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-orange-50 sm:text-base">
                Tumbuh bersama perempuan yang saling menguatkan melalui
                koperasi.
              </p>
            </div>
          </ScrollReveal>

          {/* Manfaat dan langkah bergabung */}
          <div className="grid items-center gap-5 lg:grid-cols-[1.45fr_0.9fr] lg:gap-6">
            {/* Kartu manfaat */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <ScrollReveal
                    key={benefit.title}
                    direction="up"
                    delay={index * 100}
                  >
                    <article className="group h-full rounded-2xl border border-white/30 bg-white/15 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/25 sm:p-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-orange-600">
                        <Icon size={18} strokeWidth={1.8} />
                      </div>

                      <h3 className="mt-3 text-sm font-bold leading-5 text-white sm:text-base">
                        {benefit.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-orange-50 sm:text-sm">
                        {benefit.description}
                      </p>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Panel pendaftaran */}
            <ScrollReveal direction="right" delay={150}>
              <aside className="rounded-2xl bg-white p-5 text-neutral-900 shadow-xl shadow-orange-900/10 sm:p-6 lg:p-7">
                <h3 className="text-xl font-bold tracking-tight">
                  Bergabung itu mudah
                </h3>

                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Hubungi SBW untuk mendapatkan informasi proses keanggotaan.
                </p>

                <ol className="mt-5 space-y-3">
                  {joiningSteps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>

                      <span className="text-sm font-medium text-neutral-800">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href="/kontak"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-700 hover:shadow-md active:scale-[0.99]"
                  >
                    <MessageCircle size={16} />
                    Hubungi Kami
                  </Link>

                  <Link
                    href="/keanggotaan"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-orange-500 bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition-all duration-300 hover:bg-orange-50 active:scale-[0.99]"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-neutral-500">
                  <CheckCircle2
                    size={14}
                    className="shrink-0 text-orange-600"
                  />
                  Informasi persyaratan tersedia melalui kontak SBW.
                </p>
              </aside>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}