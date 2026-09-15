import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { AboutHero } from './components/AboutHero';
import { AboutFeatures } from './components/AboutFeatures';
import { AboutWorkflow } from './components/AboutWorkflow';
import { AboutFooter } from './components/AboutFooter';

/**
 * Landing Page (LP) for 就活ESクラフト
 * Built as a React Server Component (RSC) optimized with Funstack Static.
 * Zero-client-bundle footprint for static marketing content with high semantic SEO readability.
 */
export default function AboutLpPage() {
  return (
    <div className="min-h-[100dvh] bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider group-hover:bg-neutral-800 transition-colors">
                ES
              </div>
              <span className="font-bold text-base tracking-tight text-neutral-900">
                就活ESクラフト
              </span>
            </a>
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
              オフラインIndexedDB対応
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/guide/star-method"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>推敲の極意</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>エディタを開く</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
