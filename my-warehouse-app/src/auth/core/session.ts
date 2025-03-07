import { z } from "zod";
import { userRoles } from "../../lib/mongodb";

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});

type UserSession = z.infer<typeof sessionSchema>;
export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export function createUserSession(user: UserSession, cookies: Cookies) {}
