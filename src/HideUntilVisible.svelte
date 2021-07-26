<script lang="ts">

    export let height = 1000;

    let el;
    let pageScrollY: number;
    let start = false;

    $: {
        if (el && ! start) {
           start = el && el?.getBoundingClientRect()?.top < pageScrollY + window.innerHeight;
        }
    }
</script>

<svelte:window bind:scrollY={pageScrollY}/>
<div bind:this={el}>
    {#if start}
        <slot/>
    {:else}
        <div style="height: {height};"></div>
    {/if}
</div>
