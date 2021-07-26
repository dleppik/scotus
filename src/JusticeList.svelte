<script lang="ts">
    export let justices;

    let minYear = Math.min.apply(null, justices.map(j => j.appointedYear));

    function barMargin(justice) {
        return justice.appointedYear - minYear;
    }
    function barWidth(justice) {
        return justice.retiredYear - justice.appointedYear;
    }
</script>
<style>
  table, p {
    font-size: 13px;
  }

    .name {
      text-align: left;
    }
    td {
      text-align: right;
      white-space: nowrap;
    }
    td.graph {
      text-align: left;
    }
    .graph > div {
      background: #ccc;
      height: 12px;
      vertical-align: middle;
    }
</style>

<p><i>Ages are approximate.</i></p>
<div style="max-width: 95vw; overflow-x: scroll">
    <table>
        <tr style="font-style: italic"><th>Justice</th><th>Born</th><th>Appointed</th><th>Retired</th><th>Years on Court</th></tr>
        {#each justices as justice}
            <tr>
                <th class="name">{justice.name ?? "Simulated"}</th>
                <td>{justice.birthYear}</td>
                <td>{justice.appointedYear} (age {justice.appointedYear - justice.birthYear})</td>
                <td>{justice.retiredYear}</td>
                <td>
                    {Math.max(1, justice.retiredYear - justice.appointedYear)}
                    (age {justice.retiredYear - justice.birthYear})
                </td>
                <td class="graph"><div style={`margin-left: ${barMargin(justice)}px; width: ${barWidth(justice)}px`}></div></td>
            </tr>
        {/each}
    </table>
</div>