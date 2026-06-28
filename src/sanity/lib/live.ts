import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { previewToken } from "./previewToken";

/**
 * Live content layer. `sanityFetch` reads content (drafts when previewing) and
 * `<SanityLive />` streams updates so the page re-renders the moment an editor
 * changes a value in the Studio's Presentation tool.
 *
 * `serverToken` lets the server read drafts for the Presentation tool. Prefer a
 * dedicated Viewer token (SANITY_API_READ_TOKEN); fall back to the existing
 * write token (which can also read) so previews work without extra setup.
 */

// The `sanity` package bundles its own @sanity/client copy, so the inferred
// client type differs by identity from the one defineLive expects even though
// it's the same client at runtime. Bridge the two with a type-only cast.
type LiveClient = Parameters<typeof defineLive>[0]["client"];

export const { sanityFetch, SanityLive } = defineLive({
  client: client as unknown as LiveClient,
  serverToken: previewToken,
  // Presentation drives the browser side, so a public browser token isn't
  // needed. `false` silences the dev warning.
  browserToken: false,
});
