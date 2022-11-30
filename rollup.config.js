const isProd = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.ts',
  intro: `var DEVELOPMENT = ${!isProd}`,
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  }
};