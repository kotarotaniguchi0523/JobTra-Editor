import { countNonWhitespaceCharacters } from '@shared/lib/text';
import { getContentDigest } from './contentRevision';

export type BoundedContentSummary = {
  contentDigest: string;
  charsNoWhitespace: number;
  content: string;
  contentTruncated: boolean;
};

export function summarizeBoundedContent(text: string, maxLength: number): BoundedContentSummary {
  return {
    contentDigest: getContentDigest(text),
    charsNoWhitespace: countNonWhitespaceCharacters(text),
    content: text.slice(0, maxLength),
    contentTruncated: text.length > maxLength,
  };
}
