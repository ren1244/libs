import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
export default [
    {
        input: 'pdf.js',
        output: {
            file: 'dist/light-pdf.js',
            format: 'umd',
            name: 'lightPdf',
            plugins: [
                terser()
            ]
        },
        plugins: [
            nodeResolve(),
            commonjs()
        ]
    }
];
