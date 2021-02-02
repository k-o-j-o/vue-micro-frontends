import multi from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';

export default [{
    input: './client/*.js',
    output: {
        file: './client/dist/bundle.mjs'
    },
    plugins: [
        multi(),
        resolve(),
        alias({
            entries: {
                'vue': 'vue/dist/vue.esm.js'
            }
        })
    ]
}]