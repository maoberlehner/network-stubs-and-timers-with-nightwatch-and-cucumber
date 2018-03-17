import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  plugins: [
    resolve(),
    commonjs(),
    uglify(),
  ],
};
