<script lang="ts">
    import {defaultScotusConfig} from "./ScotusConfig";

    export let histogram = {simulationCount: 0, histogramsByYear: [], config: defaultScotusConfig()};
    let config = histogram.config;

    const scale = 10;
    const leftMargin = 50;

    const maxColor = "black";
    const color1 = "#999";
    const color2 = "#d7d7d7";
    const color3 = "#f6f6f6";

    let maxScotusSize, maxScotusWidth, height, width, yTicks, xTicks;
    $: {
        maxScotusSize = Math.max(12, Math.max.apply(null, Array.from(scotusSizes(histogram.histogramsByYear))));
        maxScotusWidth = 1 + config.endYear - config.initialYear;

        height = maxScotusSize * scale;
        width = (maxScotusWidth * scale) + leftMargin;

        yTicks = [];
        for (let i=3; i < maxScotusSize; i += 3) {
            yTicks.push(i);
        }

        xTicks = [];
        for (let i=(config.initialYear); i < config.endYear; i += 5) {
            xTicks.push(i);
        }
    }

    function scaledX(year) {
        return (year - config.initialYear) * scale + leftMargin;
    }

    function scaledY(scotusSize) {
        return (maxScotusSize - scotusSize) * scale;
    }

    function color(year, scotusSize) {
        const sizes: number[] = histogram.histogramsByYear[year];
        const sizesUnindexed = Object.keys(sizes).map(s => sizes[s]);
        const count = sizes[scotusSize];
        const maxSize = Math.max.apply(null, sizesUnindexed);
        if (count === maxSize) {
            return maxColor;
        }
        const fraction = count / histogram.simulationCount;
        if (fraction >= 0.25) {
            return color1;
        }
        if (fraction >= 0.05) {
            return color2;
        }
        return color3;
    }

    function percent(year, scotusSize) {
        const size = histogram.histogramsByYear[year][scotusSize];
        return 100 * size / histogram.simulationCount;
    }

    function scotusSizes(hist): Set<number> {
        const result = new Set();
        Object.keys(hist)
            .forEach(year => Object.keys(hist[year])
                .forEach(num => result.add(num)))
        return result;
    }

</script>

<style>
    .year-ticks text,
    .y-ticks text {
      fill: #bbb;
      text-anchor: middle;
      font-size: 12px;
    }
    .y-ticks text {
      text-anchor: end;
    }
    .year-ticks line,
    .y-ticks line {
        stroke: #eee;
    }

    .status {
      display: flex;
      flex: 1;
      justify-content: space-between;
      margin: 1em 1em 1em 0;
    }

    .keyItem {
      display: inline-block;
      margin: 0 4px;
    }

    .dot {
      display: inline-block;
      border-radius: 50%;
      width: 10px;
      height: 10px;
      background: black;
      margin: 0 4px;
    }
</style>

<svg  width={width} height={height}>
    <g class="year-ticks">
        {#each xTicks as tick}
            <g transform="translate({scaledX(tick)}, 0)">
                <line y1="0" y2={height - 15} x1="0" x2="0" />
                <text y={height} x="0">{tick}</text>
            </g>
        {/each}
    </g>

    <g class="y-ticks">
        {#each yTicks as tick}
            <g transform="translate(0, {scaledY(tick)})">
                <line y1="0" y2="0" x1="14" x2={width} />
                <text y="4" x="12">{tick}</text>
            </g>
        {/each}
    </g>

    {#each Object.keys(histogram.histogramsByYear) as year}
        {#each Object.keys(histogram.histogramsByYear[year]) as scotusSize}
            <circle r={(scale-2)/2} fill={color(year, scotusSize)} cx={scaledX(year)} cy={scaledY(scotusSize)}>
                <title>{percent(year, scotusSize)}% of simulations had a {scotusSize}-member court in {year}</title>
            </circle>
        {/each}
    {/each}
</svg>


<div class="status">
    <div>
        <b>{histogram.simulationCount}</b> simulation{histogram.simulationCount === 1 ? "" : "s" }
    </div>
    <div class="key">
        <div class="keyItem">
        <span class="dot" style="background: {maxColor}"></span>Most common
        </div>
        <div class="keyItem">
            <span class="dot" style="background: {color1}"></span>25% or more
        </div>
        <div class="keyItem">
        <span class="dot" style="background: {color2}"></span>5% or more
        </div>
        <div class="keyItem">
        <span class="dot" style="background: {color3}; border: 1px solid #ddd"></span>Under 5%
        </div>
    </div>
    <div>
        Hover over the graph for details
    </div>
</div>
