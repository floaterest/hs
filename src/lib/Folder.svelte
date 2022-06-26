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

	function open(path, file: boolean){
		path = href.endsWith('/') ? `${href}${path}` : `${href}/${path}`;
		window.open(file ? path : path + '/', '_self');
	}

	function back(){
		const path = href.replace(/\/[^/]*\/?$/, '');
		window.open(path, '_self');
	}
</script>

<div id="cwd">
    <code on:click={()=>window.open('/','_self')}>{root}</code>
    {#each cwd as { dir, cum }}
        <code on:click={()=>window.open(cum,'_self')}>{sep}{dir}</code>
    {/each}
</div>
<!-- icons from material icons / google fonts -->
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
    {#each folders as path}
        <li on:click={()=>open(path,false)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                 class="icon folder"
                 viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
            {path}
        </li>
    {/each}
    {#each files as { path, component }}
        <li on:click={()=>open(path,true)}>
            {#if path.startsWith('audio')}

            {/if}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                 class="icon file"
                 viewBox="0 0 24 24" width="24px" fill="#000000">
                <svelte:component this={component}/>
            </svg>
            {path}
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
