import { auth } from "@/auth";
import { getSectionContent } from "@/lib/content";
import { AdminEditor } from "./AdminEditor";
import { AdminLogin } from "@/components/AdminLogin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Eden Electrical" };

export default async function AdminPage() {
  // `/admin` is the single, unadvertised entry point: show the login form when
  // signed out, the editor when signed in. Save actions are guarded server-side.
  const session = await auth();
  if (!session?.user) return <AdminLogin />;

  const [hero, about, contact] = await Promise.all([
    getSectionContent("hero"),
    getSectionContent("about"),
    getSectionContent("contact"),
  ]);

  return <AdminEditor initial={{ hero, about, contact }} />;
}
