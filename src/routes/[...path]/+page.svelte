<script lang="ts">
    import '$lib/app.sass';
    import { page } from '$app/stores';
    import type { Locals } from '$lib/type';
    import { Type } from '$lib/type';
    import Folder from '$lib/Folder.svelte';

    const { type, data, cwd } = $page.data as Locals;
</script>
{#if type === Type.Folder}
    <Folder {cwd} {data}/>
{:else}
    {#if type === Type.File}
        {@html data}
    {/if}
{/if}
