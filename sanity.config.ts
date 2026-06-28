import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  defineDocuments,
  defineLocations,
  presentationTool,
} from "sanity/presentation";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

// Singleton settings documents that the homepage reads from. Listing them here
// powers two things in the Presentation tool: the "Documents on this page"
// panel (mainDocuments) and the "open this page" link from inside each
// document (locations).
const HOMEPAGE_DOCUMENT_TYPES = ["pricingCalculatorSettings", "sitePhotos"];

export default defineConfig({
  name: "eden-electrical",
  title: "Eden Electrical",
  projectId,
  dataset,
  apiVersion,
  basePath: "/admin",
  plugins: [
    structureTool(),
    // "Presentation" tab — embeds the live website and updates as you edit.
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        mainDocuments: defineDocuments(
          HOMEPAGE_DOCUMENT_TYPES.map((type) => ({
            route: "/",
            filter: `_type == "${type}"`,
          }))
        ),
        locations: Object.fromEntries(
          HOMEPAGE_DOCUMENT_TYPES.map((type) => [
            type,
            defineLocations({ locations: [{ title: "Homepage", href: "/" }] }),
          ])
        ),
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
