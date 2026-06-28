import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { previewToken } from "@/sanity/lib/previewToken";

/**
 * Validates the preview secret from the Presentation tool and turns on Next.js
 * draft mode, so subsequent requests render unpublished (draft) content.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: previewToken }),
});
