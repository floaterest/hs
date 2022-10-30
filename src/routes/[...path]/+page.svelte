<script lang="ts">
    import '$lib/app.sass';
    import { page } from '$app/stores';
    import type { Content } from '$lib/type';
    import { Type } from '$lib/type';
    import Folder from '$lib/Folder.svelte';

    const { root, path, type, data } = $page.data as Content;
</script>
{#if type === Type.Folder}
    <Folder {root} {path} {data}/>
{:else}
    {#if type === Type.File}
        {@html data}
    {/if}
{/if}
