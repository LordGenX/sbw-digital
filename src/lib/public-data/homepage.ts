import "server-only";

import { prisma } from "@/lib/prisma";

export async function getPublicHero() {
  const hero = await prisma.heroSection.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      videoUrl: true,
      videoId: true,
      ctaText: true,
      ctaUrl: true,
    },
  });

  return hero;
}

export async function getPublicStatistics() {
  const statistics = await prisma.statistic.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      id: true,
      name: true,
      value: true,
      unit: true,
      description: true,
    },
  });

  return statistics.map((statistic) => ({
    ...statistic,
    value: statistic.value.toString(),
  }));
}

export async function getPublicNews() {
  return prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        not: null,
        lte: new Date(),
      },
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}

export async function getPublicEvents() {
  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startAt: {
        gte: new Date(),
      },
    },
    orderBy: [
      { startAt: "asc" },
      { createdAt: "desc" },
    ],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      startAt: true,
      endAt: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}

export async function getPublicContactInfo() {
  return prisma.contactInfo.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      address: true,
      phone: true,
      email: true,
      whatsapp: true,
      socialLinks: true,
      mapUrl: true,
    },
  });
}

export async function getPublicSiteSettings() {
  return prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      siteName: true,
      siteDescription: true,
    },
  });
}

export async function getPublicAboutHistory() {
  const history = await prisma.aboutContent.findFirst({
    where: {
      section: "HISTORY",
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      content: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });

  return history;
}

export async function getPublicAboutVisionMission() {
  return prisma.aboutContent.findFirst({
    where: {
      section: "VISION_MISSION",
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      title: true,
      content: true,
    },
  });
}

export async function getPublicAboutOrganization() {
  return prisma.aboutContent.findFirst({
    where: {
      section: "ORGANIZATION",
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      title: true,
      content: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}

export async function getPublicAboutAchievements() {
  return prisma.aboutContent.findMany({
    where: {
      section: "ACHIEVEMENT",
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    take: 6,
    select: {
      id: true,
      title: true,
      content: true,
      sortOrder: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}

export async function getAllPublicAboutAchievements() {
  return prisma.aboutContent.findMany({
    where: {
      section: "ACHIEVEMENT",
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      content: true,
      sortOrder: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}

export async function getPublicAboutAchievementsCount() {
  return prisma.aboutContent.count({
    where: {
      section: "ACHIEVEMENT",
      status: "PUBLISHED",
    },
  });
}

export async function getPublicServices() {
  return prisma.service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      description: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}

export async function getPublicMembershipInfo() {
  return prisma.membershipInfo.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      section: true,
      title: true,
      content: true,
      sortOrder: true,
      media: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
  });
}