import type { ESDraft } from '@entities/draft/model/types';

export interface DraftState {
  drafts: ESDraft[];
  activeDraftId: string;
  isLoading: boolean;
}

export type DraftAction =
  | { type: 'loaded'; drafts: ESDraft[]; activeDraftId: string }
  | { type: 'load-failed' }
  | { type: 'select'; id: string }
  | { type: 'add'; draft: ESDraft }
  | { type: 'replace'; draft: ESDraft }
  | { type: 'replace-if-current'; expected: ESDraft; draft: ESDraft }
  | { type: 'remove'; id: string; nextActiveId: string };

export const INITIAL_DRAFT_STATE: DraftState = {
  drafts: [],
  activeDraftId: '',
  isLoading: true,
};

export function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'loaded':
      return {
        ...state,
        drafts: action.drafts,
        activeDraftId: action.activeDraftId,
        isLoading: false,
      };
    case 'load-failed':
      return state.isLoading ? { ...state, isLoading: false } : state;
    case 'select':
      return state.activeDraftId === action.id ? state : { ...state, activeDraftId: action.id };
    case 'add':
      return {
        ...state,
        drafts: [action.draft, ...state.drafts],
        activeDraftId: action.draft.id,
      };
    case 'replace': {
      const index = state.drafts.findIndex((draft) => draft.id === action.draft.id);
      if (index < 0 || state.drafts[index] === action.draft) return state;

      const drafts = state.drafts.slice();
      drafts[index] = action.draft;
      return { ...state, drafts };
    }
    case 'replace-if-current': {
      const index = state.drafts.findIndex((draft) => draft === action.expected);
      if (index < 0) return state;

      const drafts = state.drafts.slice();
      drafts[index] = action.draft;
      return { ...state, drafts };
    }
    case 'remove': {
      const index = state.drafts.findIndex((draft) => draft.id === action.id);
      if (index < 0) return state;

      return {
        ...state,
        drafts: state.drafts.filter((draft) => draft.id !== action.id),
        activeDraftId: action.nextActiveId,
      };
    }
  }
}
