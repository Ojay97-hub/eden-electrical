/**
 * Server-only token used to read draft content for the Presentation tool.
 * Prefer a dedicated Viewer token; fall back to the write token (which can also
 * read) so previews work without creating a second token.
 */
export const previewToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
