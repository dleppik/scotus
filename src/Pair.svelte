<script lang="ts">
    export let a, b;
</script>

<style>
  .a {
    width: 3em;
    display: inline-block;
  }
  .b {
    display: inline-block;
    width: 40em;
    text-align: right;
    font-weight: bold;
  }
</style>

<div style="font-size: 8pt">
    <span class="a">{a}</span>
    <span class="b">{b}</span>
</div>