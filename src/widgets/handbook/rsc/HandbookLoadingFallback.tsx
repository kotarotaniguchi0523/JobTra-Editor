export function HandbookLoadingFallback() {
  return (
    <div className="space-y-2 p-8 text-center text-xs text-neutral-400">
      <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      <p>ガイドを読み込み中...</p>
    </div>
  );
}
