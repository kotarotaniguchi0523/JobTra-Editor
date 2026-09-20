import type { GhostGuidance } from '@features/writing-assistance/model/types';

export interface GhostGuidanceProps {
  guidance: GhostGuidance;
  onInsertSuggestion: (phrase: string) => void;
}
