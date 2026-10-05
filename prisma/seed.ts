import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // =========================================================
  // ADMIN DEVELOPMENT
  // =========================================================

  const email = "admin@sbw-digital.local";
  const password = "Admin123!";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: "Administrator SBW",
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Admin development berhasil dibuat:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: admin.isActive,
  });

  // =========================================================
  // ABOUT CONTENT
  // =========================================================

  const aboutContents = [
    {
      id: "11111111-1111-4111-8111-111111111111",
      section: "HISTORY" as const,
      title: "Sejarah SBW",
      content:
        "Koperasi Konsumen Setia Budi Wanita Malang merupakan koperasi yang berkembang melalui semangat kebersamaan, kemandirian, dan pemberdayaan anggota.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      section: "VISION_MISSION" as const,
      title: "Visi & Misi",
      content:
        "Visi dan misi Koperasi Konsumen Setia Budi Wanita Malang menjadi landasan dalam menjalankan organisasi dan memberikan manfaat bagi anggota serta masyarakat.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      section: "PROFILE" as const,
      title: "Profil SBW",
      content:
        "Koperasi Konsumen Setia Budi Wanita Malang merupakan organisasi koperasi yang berkomitmen untuk memberikan manfaat dan mengembangkan kemandirian anggota.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "44444444-4444-4444-8444-444444444444",
      section: "ORGANIZATION" as const,
      title: "Struktur Organisasi",
      content:
        "Struktur organisasi SBW menggambarkan susunan kepengurusan dan pembagian tanggung jawab dalam menjalankan organisasi koperasi.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "55555555-5555-4555-8555-555555555555",
      section: "ACHIEVEMENT" as const,
      title: "Prestasi SBW",
      content:
        "SBW memiliki berbagai pencapaian dan kontribusi yang menjadi bagian dari perjalanan serta perkembangan organisasi.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
  ];

  for (const about of aboutContents) {
    const result = await prisma.aboutContent.upsert({
      where: {
        id: about.id,
      },
      update: {
        section: about.section,
        title: about.title,
        content: about.content,
        status: about.status,
        sortOrder: about.sortOrder,
        updatedById: admin.id,
      },
      create: {
        id: about.id,
        section: about.section,
        title: about.title,
        content: about.content,
        mediaId: null,
        status: about.status,
        sortOrder: about.sortOrder,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    console.log(
      `AboutContent berhasil disiapkan: ${result.section}`,
    );
  }

  // =========================================================
  // MEMBERSHIP INFO
  // =========================================================
  
  const membershipInfos = [
    {
      id: "71111111-1111-4111-8111-111111111111",
      section: "WHY_JOIN" as const,
      title: "Mengapa Menjadi Anggota",
      content:
        "Menjadi anggota Koperasi Konsumen Setia Budi Wanita memberikan kesempatan untuk mendapatkan berbagai manfaat keanggotaan serta berpartisipasi dalam pengembangan koperasi.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "72222222-2222-4222-8222-222222222222",
      section: "BENEFIT" as const,
      title: "Benefit Anggota",
      content:
        "Anggota dapat memperoleh berbagai manfaat sesuai dengan ketentuan dan layanan yang tersedia di Koperasi Konsumen Setia Budi Wanita.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "73333333-3333-4333-8333-333333333333",
      section: "REQUIREMENT" as const,
      title: "Syarat Keanggotaan",
      content:
        "Calon anggota perlu memenuhi persyaratan keanggotaan yang ditetapkan oleh Koperasi Konsumen Setia Budi Wanita dan mengikuti ketentuan yang berlaku.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "74444444-4444-4444-8444-444444444444",
      section: "HOW_TO_REGISTER" as const,
      title: "Cara Mendaftar",
      content:
        "Pendaftaran anggota dilakukan dengan mengikuti prosedur pendaftaran yang ditetapkan oleh Koperasi Konsumen Setia Budi Wanita. Informasi lebih lanjut dapat diperoleh melalui kontak resmi SBW.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "75555555-5555-4555-8555-555555555555",
      section: "FAQ" as const,
      title: "FAQ Keanggotaan",
      content:
        "Siapa yang dapat menjadi anggota? Masyarakat yang memenuhi ketentuan keanggotaan koperasi dapat mengajukan diri sebagai anggota sesuai prosedur yang berlaku.\n\nBagaimana cara mendapatkan informasi pendaftaran? Informasi mengenai pendaftaran dapat diperoleh melalui kanal kontak resmi SBW.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
  ];

  for (const membership of membershipInfos) {
    const result = await prisma.membershipInfo.upsert({
      where: {
        id: membership.id,
      },
      update: {
        section: membership.section,
        title: membership.title,
        content: membership.content,
        status: membership.status,
        sortOrder: membership.sortOrder,
        updatedById: admin.id,
      },
      create: {
        id: membership.id,
        section: membership.section,
        title: membership.title,
        content: membership.content,
        mediaId: null,
        status: membership.status,
        sortOrder: membership.sortOrder,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    console.log(
      `MembershipInfo berhasil disiapkan: ${result.section}`,
    );
  }

  // =========================================================
  // SERVICE
  // =========================================================

  const services = [
    {
      id: "61111111-1111-4111-8111-111111111111",
      name: "Simpan Pinjam",
      slug: "simpan-pinjam",
      shortDescription:
        "Layanan koperasi yang mendukung kebutuhan anggota melalui kegiatan simpan pinjam.",
      description:
        "Simpan Pinjam merupakan salah satu layanan SBW yang menyediakan informasi mengenai layanan simpan pinjam bagi anggota koperasi.",
      status: "PUBLISHED" as const,
      sortOrder: 1,
    },
    {
      id: "62222222-2222-4222-8222-222222222222",
      name: "SBW Mart",
      slug: "sbw-mart",
      shortDescription:
        "Layanan usaha ritel SBW yang menyediakan berbagai kebutuhan bagi anggota dan masyarakat.",
      description:
        "SBW Mart merupakan layanan usaha ritel yang menyediakan berbagai kebutuhan anggota dan masyarakat sebagai bagian dari pengembangan usaha koperasi.",
      status: "PUBLISHED" as const,
      sortOrder: 2,
    },
    {
      id: "63333333-3333-4333-8333-333333333333",
      name: "Sekretariat dan Umum",
      slug: "sekretariat-dan-umum",
      shortDescription:
        "Layanan informasi dan kebutuhan administrasi umum Koperasi Konsumen Setia Budi Wanita.",
      description:
        "Sekretariat dan Umum menyediakan informasi serta mendukung kebutuhan administrasi dan kegiatan umum Koperasi Konsumen Setia Budi Wanita.",
      status: "PUBLISHED" as const,
      sortOrder: 3,
    },
    {
      id: "64444444-4444-4444-8444-444444444444",
      name: "Learning Center",
      slug: "learning-center",
      shortDescription:
        "Pusat pembelajaran dan pengembangan pengetahuan serta keterampilan.",
      description:
        "Learning Center merupakan layanan yang mendukung kegiatan pembelajaran, pengembangan pengetahuan, dan peningkatan keterampilan.",
      status: "PUBLISHED" as const,
      sortOrder: 4,
    },
    {
      id: "65555555-5555-4555-8555-555555555555",
      name: "Tour and Travel",
      slug: "tour-and-travel",
      shortDescription:
        "Layanan perjalanan dan wisata yang dikelola sebagai bagian dari unit usaha SBW.",
      description:
        "Tour and Travel merupakan layanan perjalanan dan wisata yang menyediakan informasi mengenai berbagai kebutuhan perjalanan.",
      status: "PUBLISHED" as const,
      sortOrder: 5,
    },
    {
      id: "66666666-6666-4666-8666-666666666666",
      name: "Cafe Cahaya Baru",
      slug: "cafe-cahaya-baru",
      shortDescription:
        "Layanan kuliner SBW yang menyediakan tempat dan pilihan makanan serta minuman.",
      description:
        "Cafe Cahaya Baru merupakan unit layanan kuliner yang menjadi bagian dari kegiatan usaha SBW.",
      status: "PUBLISHED" as const,
      sortOrder: 6,
    },
    {
      id: "67777777-7777-4777-8777-777777777777",
      name: "Kavling Tanah",
      slug: "kavling-tanah",
      shortDescription:
        "Layanan informasi terkait kavling tanah yang dikelola sebagai bagian dari unit usaha SBW.",
      description:
        "Kavling Tanah merupakan layanan yang menyediakan informasi mengenai produk atau layanan kavling tanah yang tersedia di SBW.",
      status: "PUBLISHED" as const,
      sortOrder: 7,
    },
    {
      id: "68888888-8888-4888-8888-888888888888",
      name: "DPP Griya Sehat",
      slug: "dpp-griya-sehat",
      shortDescription:
        "Layanan yang berkaitan dengan kebutuhan kesehatan melalui DPP Griya Sehat.",
      description:
        "DPP Griya Sehat merupakan layanan SBW yang berkaitan dengan kebutuhan dan informasi layanan kesehatan.",
      status: "PUBLISHED" as const,
      sortOrder: 8,
    },
  ];

  for (const service of services) {
    const result = await prisma.service.upsert({
      where: {
        id: service.id,
      },
      update: {
        name: service.name,
        slug: service.slug,
        shortDescription: service.shortDescription,
        description: service.description,
        status: service.status,
        sortOrder: service.sortOrder,
        updatedById: admin.id,
      },
      create: {
        id: service.id,
        name: service.name,
        slug: service.slug,
        shortDescription: service.shortDescription,
        description: service.description,
        mediaId: null,
        status: service.status,
        sortOrder: service.sortOrder,
        metaTitle: null,
        metaDescription: null,
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    console.log(
      `Service berhasil disiapkan: ${result.name}`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });