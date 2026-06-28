import { Studio } from "../Studio";
import {
  metadata as studioMetadata,
  viewport as studioViewport,
} from "next-sanity/studio";
import type { Metadata, Viewport } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Eden Electrical Admin",
};

export const viewport: Viewport = {
  ...studioViewport,
};

export default async function AdminPage() {
  return <Studio />;
}
