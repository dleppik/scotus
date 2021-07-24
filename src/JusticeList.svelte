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
    font-size: 12px;
  }

    .name {
      text-align: left;
    }
    td {
      text-align: right;
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

<p>Age at time of appointment is approximate.</p>

<table>
    <tr><th>Justice</th><th>Born</th><th>Appointed</th><th>Retired</th><th>Years on Court</th></tr>
    {#each justices as justice}
        <tr>
            <th class="name">{justice.name ?? "Simulated"}</th>
            <td>{justice.birthYear}</td>
            <td>{justice.appointedYear} (age {justice.appointedYear - justice.birthYear})</td>
            <td>{justice.retiredYear}</td>
            <td>{Math.max(1, justice.retiredYear - justice.appointedYear)}</td>
            <td class="graph"><div style={`margin-left: ${barMargin(justice)}px; width: ${barWidth(justice)}px`}></div></td>
        </tr>
    {/each}
</table>