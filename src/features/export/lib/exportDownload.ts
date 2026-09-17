/** Browser-only download effect. Keep it outside pure export text builders. */
export function downloadFile(content: string | Blob, filename: string, mimeType: string): void {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: `${mimeType};charset=utf-8;` });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
