import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

type ImageRef = { asset?: { _ref?: string; _id?: string } } | null | undefined;

/** Builds a CDN image URL for a Sanity image field, or undefined if unset. */
export function urlForImage(source: ImageRef) {
  if (!source?.asset?._ref && !source?.asset?._id) return undefined;
  return builder.image(source as SanityImageSource);
}
