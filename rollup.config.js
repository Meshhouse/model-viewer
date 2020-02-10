import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import typescript from "rollup-plugin-typescript2";
import typescriptCompiler from "typescript";
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

const preprocessOptions = {
  scss: {
    includePaths: [
      'node_modules',
      'src'
    ]
  },
  postcss: {
    plugins: [
      require('autoprefixer'),
    ]
  }
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      customElement: true,
      dev: !production,
      preprocess: autoPreprocess(preprocessOptions),
    }),
    typescript({ typescript: typescriptCompiler }),
    resolve({
      browser: true,
      dedupe: [
        'svelte',
        'three'
      ]
    }),
    commonjs(),
    !production && serve(),
    !production && livereload('public'),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  };
}
