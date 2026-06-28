import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../../sanity/env";

/**
 * Read-only client for the public site. `stega` embeds content-source metadata
 * into responses so the Presentation tool can power visual editing; it's only
 * active during draft mode, so published pages are unaffected.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: "/admin",
  },
});
