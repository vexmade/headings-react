import { readFileSync } from 'fs';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

export default [
  {
    input: 'src/index.ts',
    output: [{ file: pkg.main, format: 'esm', sourcemap: true }],
    plugins: [external(), nodeResolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
