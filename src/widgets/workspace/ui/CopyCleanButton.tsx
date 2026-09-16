import { Check, Copy, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { cleanForSubmission } from '@features/writing-assistance/lib/analyzer';

type CopyState = { status: 'idle' } | { status: 'success' } | { status: 'error'; message: string };

const INITIAL_COPY_STATE: CopyState = { status: 'idle' };

interface CopyCleanButtonProps {
  content: string | null;
}

export function CopyCleanButton({ content }: CopyCleanButtonProps) {
  const [state, submitCopy, isPending] = useActionState(
    async (_previousState: CopyState): Promise<CopyState> => {
      if (!content) return { status: 'error', message: 'コピーする本文がありません。' };

      try {
        await navigator.clipboard.writeText(cleanForSubmission(content));
        return { status: 'success' };
      } catch (error) {
        return {
          status: 'error',
          message:
            error instanceof Error ? error.message : 'クリップボードへのコピーに失敗しました。',
        };
      }
    },
    INITIAL_COPY_STATE,
  );

  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';

  return (
    <form action={submitCopy}>
      <button
        id="clean-copy-btn"
        type="submit"
        disabled={isPending || !content}
        className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all sm:gap-1.5 sm:px-3 ${
          isSuccess
            ? 'bg-emerald-600 text-white shadow-xs'
            : isError
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } disabled:cursor-not-allowed disabled:bg-neutral-400`}
        title={
          isError ? state.message : '余分な空白・改行を整えてWeb提出用形式でクリップボードにコピー'
        }
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            <span className="hidden sm:inline">コピー中...</span>
            <span className="sm:hidden">処理中</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">コピー完了</span>
            <span className="sm:hidden">完了</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{isError ? '再試行' : '提出用にコピー'}</span>
            <span className="sm:hidden">{isError ? '再試行' : 'コピー'}</span>
          </>
        )}
      </button>
    </form>
  );
}
