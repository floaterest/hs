<script lang="ts">
    import type { Entry } from './type';
    import { Type } from './type';
    import { page } from '$app/stores';

    export let root: string;
    export let path: string;
    export let data: Entry[];

    const { href, pathname } = $page.url;

    function url({ path, type }: Entry){
        // add path after href
        path = `${href}${href.endsWith('/') ? '' : '/'}${path}`;
        return type === Type.File ? path : path + '/';
    }

</script>

{#each data as { path, type }}
    <div class="entry">
        <span class="material-icons-round {type}">{type}</span>
        <a href="{url({path,type})}" target="_top">{path}</a>
    </div>
{/each}

<style lang="sass">
    @use 'colors' as *
    .entry
        display: flex
        align-items: center
        white-space: nowrap
    .folder
        color: $yellow
    a
        text-decoration: none
        padding-left: 0.1em
        color: unset
</style>
