<script lang="ts" context="module">
	export const load = async({ props }) => ({ status: 200, stuff: props });
</script>
<script lang="ts">
	import { page } from '$app/stores';

	//@ts-ignore
	const { root, cwd, folders, files } = $page.stuff;
	const { href, pathname } = $page.url;

	function open(path){
		path = href.endsWith('/') ? `${href}${path}` : `${href}/${path}`;
		window.open(path, '_self');
	}

	function back(){
		const path = href.replace(/\/[^/]*$/, '');
		window.open(path, '_self');
	}
</script>

<div>
    <span>{root}</span>
    {#each cwd as dir}
        <span>{dir}</span>
    {/each}
</div>
<ul>
    {#if pathname !== '/'}
        <li on:click={back}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                 class="icon folder"
                 viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            ..
        </li>
    {/if}
    {#each folders as folder}
        <li on:click={()=>open(folder)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                 class="icon folder"
                 viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            {folder}
        </li>
    {/each}
    {#each files as file}
        <li on:click={()=>open(file)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                 class="icon file"
                 viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
            </svg>
            {file}
        </li>
    {/each}
</ul>

<style lang="sass">
    .icon
        font-size: 1em
        padding-right: 0.5em
        user-select: none

        &.folder
            fill: var(--yellow)

        &.file
            fill: var(--white)

    ul
        padding: 0

    li
        display: flex
        padding-left: 1em
        align-items: center
        cursor: pointer

        &:hover
            background-color: var(--dark)
</style>
