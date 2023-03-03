<script lang="ts">
    import type { AccCur, Entry } from './type';
    import { Type } from './type';
    import { page } from '$app/stores';

    export let cwd: AccCur[];
    export let data: Entry[];

    const { href, pathname } = $page.url;

    function url({ path, type }: Entry){
        // add path after href
        path = `${href}${href.endsWith('/') ? '' : '/'}${path}`;
        return type === Type.File ? path : path + '/';
    }
</script>

<div id="cwd">
    {#each cwd as { acc, cur }}
        <a href="{acc}" target="_self">{cur}</a>
    {/each}
</div>

{#each data as { path, type }}
    <div class="entry">
        <span class="material-icons-round {type}">{type}</span>
        <a href="{url({path,type})}" target="_top">{path}</a>
    </div>
{/each}

<style lang="sass">
    @use 'colors' as *
    #cwd
        display: flex
        font-family: 'Iosevka Web', sans-serif
    a
        text-decoration: none
        color: unset
    .entry
        display: flex
        align-items: center
        white-space: nowrap
        overflow: clip
        a
            padding-left: 0.1em
    .folder
        color: $yellow
</style>
