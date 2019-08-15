// rollup.config.js
import babel from 'rollup-plugin-babel';
export default [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/redux-interval-middleware.js',
      format: 'cjs'
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }
];
