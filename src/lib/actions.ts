"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { signIn, signOut, auth } from "@/auth";
import { saveSectionContent, type Section, CONTENT_DEFAULTS } from "@/lib/content";

export type AuthState = { error?: string } | undefined;

/** Sign in with credentials. Returns an error string on failure (for the form). */
export async function authenticate(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Incorrect email or password." };
    }
    throw error; // re-throw redirect control-flow
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/** Persist content edits for a section. Guarded — requires an authenticated user. */
export async function saveContentAction(
  section: Section,
  fields: Record<string, string>
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Not authenticated" };

  if (!(section in CONTENT_DEFAULTS)) {
    return { ok: false, error: "Unknown section" };
  }

  await saveSectionContent(section, fields);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
