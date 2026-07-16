// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  { ignores: ['e2e/**'] },
  {
    rules: {
      // Apagada: el proyecto agrupa varios miembros por línea separados por
      // coma dentro de interfaces que igualmente abarcan varias líneas
      // (p.ej. `interface Foo { a: string, b: number\n  c: string }`) — un
      // estilo intencional que esta regla no modela (su par single/multiline
      // no tiene un modo para "varios miembros por línea, bloque multilínea").
      '@stylistic/member-delimiter-style': 'off',
      // El proyecto usa mucho el patrón `function foo(x) { y.value = x }` en
      // una línea para setters cortos — cuenta como 2 "statements" (la
      // declaración + el cuerpo) aunque sea perfectamente legible.
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
    },
  },
)
