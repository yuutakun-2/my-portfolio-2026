import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map of project title -> { startDate, endDate }
// Dates derived from GitHub repo created_at (start) and pushed_at (end)
const projectDates: Record<
  string,
  { startDate: string; endDate: string | null }
> = {
  "Audio Transcriber": { startDate: "Apr 2026", endDate: "Apr 2026" },
  "AWS Developer Old Questions": { startDate: "Oct 2025", endDate: "Aug 2026" },
  ScholarshipBridge: { startDate: "Apr 2025", endDate: "Sep 2025" },
  TechSuggest: { startDate: "Feb 2025", endDate: "Mar 2025" },
  "Movie World": { startDate: "Feb 2025", endDate: "Feb 2025" },
  "Social Media App": { startDate: "Feb 2025", endDate: "May 2025" },
  "Social Media App - React Native": {
    startDate: "Feb 2025",
    endDate: "Feb 2025",
  },
  "Express social media API": { startDate: "Feb 2025", endDate: "May 2025" },
  "Tech Thoughts": { startDate: "Jul 2024", endDate: "Feb 2025" },
  "Mobile payment app (ongoing)": { startDate: "Feb 2025", endDate: null },
};

async function main() {
  const projects = await prisma.project.findMany();

  for (const project of projects) {
    const dates = projectDates[project.title];
    if (!dates) {
      console.log(`SKIP (no data): ${project.title}`);
      continue;
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        startDate: dates.startDate,
        endDate: dates.endDate,
      },
    });
    console.log(
      `UPDATED: ${project.title} -> ${dates.startDate} - ${dates.endDate ?? "Present"}`,
    );
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
