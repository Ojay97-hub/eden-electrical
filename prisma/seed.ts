import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CONTENT_DEFAULTS } from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  // Seed an admin user. Override via env for non-local environments.
  const email = process.env.ADMIN_EMAIL ?? "phil@edenelectrical.co.uk";
  const password = process.env.ADMIN_PASSWORD ?? "password";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Phil" },
    create: { email, name: "Phil", passwordHash },
  });
  console.log(`✓ admin user ready: ${email}`);

  // Seed editable content with the prototype defaults.
  for (const [section, fields] of Object.entries(CONTENT_DEFAULTS)) {
    for (const [field, value] of Object.entries(fields)) {
      await prisma.content.upsert({
        where: { section_field: { section, field } },
        update: {},
        create: { section, field, value: String(value) },
      });
    }
  }
  console.log("✓ content defaults seeded");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
