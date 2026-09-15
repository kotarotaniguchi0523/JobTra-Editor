export default {
  // Funstack Static / Express full-stack architecture allowances
  ignore: {
    files: ['dist/**', 'tests/**', '**/*.test.ts'],
  },
  rules: {
    // 1. レンダリング・アロケーション・JavaScript最適化（パフォーマンスの無駄を排除）
    'react-doctor/rendering-hoist-jsx': 'warn',
    'react-doctor/prefer-module-scope-pure-function': 'warn',
    'react-doctor/prefer-module-scope-static-value': 'warn',
    'react-doctor/no-barrel-import': 'warn',
    'react-doctor/no-usememo-simple-expression': 'warn',
    'react-doctor/no-array-index-key': 'warn',
    'react-doctor/js-combine-iterations': 'warn',
    'react-doctor/js-early-exit': 'warn',
    'react-doctor/js-length-check-first': 'warn',
    'react-doctor/js-tosorted-immutable': 'warn',
    'react-doctor/no-unbounded-animation-frame-loop': 'warn',

    // 2. デッドコード・不要な資産の排除
    'react-doctor/unused-file': 'warn',
    'react-doctor/unused-export': 'warn',
    'react-doctor/unused-type': 'warn',
    'react-doctor/unused-dev-dependency': 'warn',
    // サーバー用（express/dotenv/@google/genai）や動的利用パッケージを検知した場合に備えてoff
    'react-doctor/unused-dependency': 'off',

    // 3. 状態管理・Reactアーキテクチャの規約強化（保守性の無駄を抑制）
    'react-doctor/prefer-useReducer': 'warn',
    'react-doctor/no-cascading-set-state': 'warn',
    'react-doctor/jsx-no-useless-fragment': 'warn',
    'react-doctor/no-many-boolean-props': 'warn',
    'react-doctor/hooks-no-nan-in-deps': 'warn',
    'react-doctor/no-impure-call-at-module-scope': 'warn',
    'react-doctor/circular-dependency': 'warn',
    'react-doctor/prefer-function-component': 'warn',
    'react-doctor/self-closing-comp': 'warn',

    // 4. UI手戻り・アクセシビリティ・デザインスロップ防止
    'react-doctor/no-hover-only-reveal': 'warn',
    'react-doctor/no-outline-none': 'warn',
    'react-doctor/no-gray-on-colored-background': 'warn',
    'react-doctor/no-arbitrary-px-font-size': 'warn',
    'react-doctor/no-nested-card-surface': 'warn',
    'react-doctor/no-generic-purple-blue-icon-gradient': 'warn',
    'react-doctor/no-dark-mode-glow': 'warn',
    'react-doctor/no-decorative-blur-orb': 'warn',
    'react-doctor/no-side-tab-border': 'warn',
    'react-doctor/no-pure-black-background': 'warn',
    'react-doctor/no-pure-black-shadow': 'warn',
    'react-doctor/prefer-dvh-over-vh': 'warn',
    'react-doctor/prefer-tabular-numeric-data': 'warn',
    'react-doctor/no-skipped-heading-level': 'warn',
    'react-doctor/no-tiny-text': 'warn',

    // 5. アニメーション・CSSパフォーマンス
    'react-doctor/no-layout-transition-inline': 'warn',
    'react-doctor/no-tailwind-layout-transition': 'warn',
    'react-doctor/prefer-motion-transform-property': 'warn',

    // Funstack Static SSG用の generateStaticParams export を許容
    'react-doctor/only-export-components': 'off',
  },
};
