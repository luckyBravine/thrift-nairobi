import "dotenv/config";
import { auth } from "../auth/auth";

async function main() {
  const email = process.env.SEED_SUPERADMIN_EMAIL ?? "owner@thift.ke";
  const password = process.env.SEED_SUPERADMIN_PASSWORD ?? "change-me-now";
  const name = "Owner";

  // Prefer auth.api if available in your BA version:
  const user = await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role: "superadmin" as never,
    },
  });

  console.log("Superadmin ready:", user);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});