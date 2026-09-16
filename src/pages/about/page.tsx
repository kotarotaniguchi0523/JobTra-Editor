import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { AboutHero } from '@pages/about/ui/AboutHero';
import { AboutFeatures } from '@pages/about/ui/AboutFeatures';
import { AboutWorkflow } from '@pages/about/ui/AboutWorkflow';
import { AboutFooter } from '@pages/about/ui/AboutFooter';

/**
 * Landing Page (LP) for 就活ESクラフト
 * Built as a React Server Component (RSC) optimized with Funstack Static.
 * Zero-client-bundle footprint for static marketing content with high semantic SEO readability.
 */
export default function AboutLpPage() {
  return (
    <div className="min-h-[100dvh] bg-neutral-50 font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="group flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 font-mono text-sm font-bold tracking-wider text-white transition-colors group-hover:bg-neutral-800">
                ES
              </div>
              <span className="text-base font-bold tracking-tight text-neutral-900">
                就活ESクラフト
              </span>
            </a>
            <span className="hidden rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 md:inline-block">
              オフラインIndexedDB対応
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/guide/star-method"
              className="hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:inline-flex"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>推敲の極意</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-neutral-800"
            >
              <span>エディタを開く</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <AboutHero />

      {/* Features Showcase */}
      <AboutFeatures />

      {/* Workflow & Privacy Section */}
      <AboutWorkflow />

      {/* Footer */}
      <AboutFooter />
    </div>
  );
}
