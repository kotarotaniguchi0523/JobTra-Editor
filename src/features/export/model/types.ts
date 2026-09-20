export interface MarkdownExportOptions {
  includeStar?: boolean;
  includeAuditSummary?: boolean;
  includeFrontmatter?: boolean;
  exportedAt: string;
}

/** Options for the browser-side PDF download operation. */
export interface PdfExportOptions {
  includeStar?: boolean;
  includeMeta?: boolean;
}
