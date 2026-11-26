import ScrollReveal from "@/components/public/ScrollReveal";

type ContactInformationProps = {
  contactInfo: {
    address: string;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
  } | null;
};

export default function ContactInformation({
  contactInfo,
}: ContactInformationProps) {
  const whatsappNumber = contactInfo?.whatsapp
    ?.replace(/\D/g, "")
    .replace(/^0/, "62");

  const contactItems = [
    {
      title: "Alamat",
      value: contactInfo?.address,
      description: "Kunjungi kantor kami",
      symbol: "⌖",
      href: null,
    },
    {
      title: "Telepon",
      value: contactInfo?.phone,
      description: "Hubungi kami melalui telepon",
      symbol: "☎",
      href: contactInfo?.phone
        ? `tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`
        : null,
    },
    {
      title: "Email",
      value: contactInfo?.email,
      description: "Kirim pertanyaan melalui email",
      symbol: "✉",
      href: contactInfo?.email
        ? `mailto:${contactInfo.email}`
        : null,
    },
    {
      title: "WhatsApp",
      value: contactInfo?.whatsapp,
      description: "Hubungi kami melalui WhatsApp",
      symbol: "↗",
      href: whatsappNumber
        ? `https://wa.me/${whatsappNumber}`
        : null,
    },
  ].filter((item) => item.value?.trim());

  return (
    <section
      id="informasi-kontak"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Tetap Terhubung
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Informasi Kontak
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Silakan hubungi kami melalui informasi kontak berikut
              untuk mendapatkan bantuan dan informasi lebih lanjut.
            </p>
          </div>
        </ScrollReveal>

        {contactItems.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delay={index * 100}
              >
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                    <span aria-hidden="true">{item.symbol}</span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  {item.href ? (
                    <a
                      href={item.href}
                      target={
                        item.title === "WhatsApp" ? "_blank" : undefined
                      }
                      rel={
                        item.title === "WhatsApp"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="mt-4 inline-block wrap-break-word text-sm font-semibold leading-6 text-orange-700 transition hover:text-orange-900 hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-4 wrap-break-word text-sm font-semibold leading-6 text-slate-800">
                      {item.value}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-500">
            Informasi kontak belum tersedia.
          </p>
        )}
      </div>
    </section>
  );
}