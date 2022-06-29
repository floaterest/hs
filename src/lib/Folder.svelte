<script lang="ts">
	import Audio from '$lib/Icons/Audio.svelte';
	import Image from '$lib/Icons/Image.svelte';
	import Other from '$lib/Icons/Other.svelte';
	import Text from '$lib/Icons/Text.svelte';
	import Video from '$lib/Icons/Video.svelte';

	import { page } from '$app/stores';

	const { root, cwd, sep, folders } = $page.stuff;
	const { href, pathname } = $page.url;
	//@ts-ignore
	const files = $page.stuff.files.map(({ path, type }) => {
		let component = Other;
		switch(type){
			case 'audio':
				component = Audio;
				break;
			case 'image':
				component = Image;
				break;
			case 'text':
				component = Text;
				break;
			case 'video':
				component = Video;
				break;
		}
		return { path, component };
	});

	function url(path, file: boolean){
		path = href.endsWith('/') ? `${href}${path}` : `${href}/${path}`;
		return file ? path : path + '/';
	}

</script>

<div id="cwd">
    <code><a href="/" target="_self">{root}</a></code>
    {#each cwd as { dir, cum }}
        <code><a href="{cum}" target="_self">{sep}{dir}</a></code>
    {/each}
</div>
<!-- icons from material icons / google fonts -->
<ul>
    {#if pathname !== '/'}
        <!-- <li on:click={back}> -->
        <li>
            <a href="{href.replace(/\/[^/]*\/?$/, '')}">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                     class="icon folder"
                     viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                </svg>
                ..
            </a>
        </li>
    {/if}
    {#each folders as path}
        <li>
            <a href="{url(path, false)}" target="_self">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                     class="icon folder"
                     viewBox="0 0 24 24" width="24px" fill="#000000">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                </svg>
                {path}
            </a>
        </li>
    {/each}
    {#each files as { path, component }}
        <li>
            <a href="{url(path, true)}" target="_self">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                     class="icon file"
                     viewBox="0 0 24 24" width="24px" fill="#000000">
                    <svelte:component this={component}/>
                </svg>
                {path}
            </a>
        </li>
    {/each}
</ul>

<style lang="sass">
    #cwd
        display: flex

        code
            border-radius: 0.15em
            cursor: pointer

            &:hover
                background-color: var(--dark)
                text-decoration: underline

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
            padding-left: 1em
            &:hover
                background-color: var(--dark)
    a
        display: flex
        align-items: center
        cursor: pointer
        color: unset
        width: 100%
        text-decoration: none
</style>
