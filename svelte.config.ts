import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import type { Config } from '@sveltejs/kit';

export default {
    preprocess: preprocess(),
    kit: {
        adapter: adapter(),
        trailingSlash: 'ignore'
    }
} as Config;
