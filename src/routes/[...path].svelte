<script lang="ts" context="module">
	export const load = async({ props }) => ({ stuff: props });
</script>
<script lang="ts">
	import { page } from '$app/stores';
	import { Type } from '$lib/types';

	import Folder from '$lib/Folder.svelte';
	import File from '$lib/File.svelte';

	const { type } = $page.stuff;
</script>

{#if type === Type.Folder}
    <Folder/>
{:else}
    {#if type === Type.File}
        <File/>
    {/if}
{/if}
