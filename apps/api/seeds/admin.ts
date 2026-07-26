import { randomUUID } from "node:crypto";

export default async function (env: NodeJS.ProcessEnv) {
  return {
    users: [
      {
        user_id: randomUUID(),
        role: "admin",
        email: env.SUPER_ADMIN_EMAIL,
        status: "active",
      },
    ],
  };
}
