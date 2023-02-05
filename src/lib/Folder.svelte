<script lang="ts">
    import type { AccCur, Entry } from './type';
    import { Type } from './type';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import '@floaterest/iosevka/iosevka.css';

    export let cwd: AccCur[];
    export let data: Entry[];
    export let root: string;

    const { href } = $page.url;
    let files: FileList;
    $: if (files) {
        for (const file of files) {
            let r = new FileReader();
            // r.onload = ({ target }) => console.log(target?.result);
            r.onload = ({ target }) =>
                fetch('./', {
                    method: 'POST',
                    body: target?.result,
                    headers: { root, name: file.name },
                });
            // r.readAsBinaryString(file);
            r.readAsText(file);
            console.log(file.name);
        }
    }

    let storage = browser && JSON.parse(localStorage.getItem('local') ?? '{}');
    $: browser && localStorage.setItem('local', JSON.stringify(storage));

    function url({ path, type }: Entry) {
        // add path after href
        path = `${href}${href.endsWith('/') ? '' : '/'}${path}`;
        return type === Type.File ? path : path + '/';
    }

    function update(path: string) {
        storage = {
            ...storage,
            [path]: new Date().toISOString().substring(0, 10),
        };
    }
</script>

<div id="cwd">
    {#each cwd as { acc, cur }}
        <a href={acc} target="_self">{cur}</a>
    {/each}
</div>

<!-- <form method="POST"> -->
<input bind:files multiple type="file" name="files" />
<!-- <button>Submit</button> -->
<!-- </form> -->

{#each data as { path, type }}
    {@const href = url({ path, type })}
    <div class="entry">
        <span on:click={() => update(href)} class="material-icons-round {type}"
            >{type}</span
        >
        <a {href} target="_top">{path}</a>
        <code>{storage[href] ?? '1970-01-01'}</code>
    </div>
{/each}

<style lang="sass">
    @use 'colors' as *
    #cwd
        display: flex
        font-family: 'Iosevka Web', sans-serif
    code
        font-family: 'Iosevka Web', sans-serif
    a
        text-decoration: none
        color: unset
    span
        cursor: pointer
    .entry
        display: flex
        align-items: center
        white-space: nowrap
        overflow: clip
        a
            padding-left: 0.1em
            flex: 1
    .folder
        color: $yellow
</style>
