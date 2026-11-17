// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['image/**', 'agent/**'],
  rules: {
    // Prettier owns formatting; this rule conflicts with how Prettier writes void elements.
    'vue/html-self-closing': 'off',
  },
})
