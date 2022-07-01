<script lang="ts">
	import { page } from '$app/stores';

	const { content } = $page.stuff;
</script>

<code>{content}</code>

<style lang="sass">
    code
        white-space: pre
</style>
