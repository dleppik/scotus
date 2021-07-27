<script lang="ts">
    import {defaultScotusConfig} from "./ScotusConfig";

    export let histogram = {simulationCount: 0, histogramsByYear: [], config: defaultScotusConfig()};

    const scale = 10;
    const leftMargin = 50;
    const bottomMargin = 10;

    const maxColor = "black";
    const color1 = "#999";
    const color2 = "#d7d7d7";
    const color3 = "#f6f6f6";

    let helpText = "";

    let maxScotusSize, maxScotusWidth, height, width, yTicks, xTicks;
    $: {
        let config = histogram.config;
        maxScotusSize = Math.max(12, Math.max.apply(null, Array.from(scotusSizes(histogram.histogramsByYear))));
        maxScotusWidth = 1 + config.endYear - config.initialYear;

        height = maxScotusSize * scale + bottomMargin;
        width = maxScotusWidth * scale + leftMargin;

        yTicks = [];
        for (let i=3; i < maxScotusSize; i += 3) {
            yTicks.push(i);
        }

        xTicks = [];
        const xTickStart = Math.floor((config.initialYear + 4) / 5) * 5;
        for (let i=(xTickStart); i < config.endYear; i += 5) {
            xTicks.push(i);
        }

        helpText = overallStats();
    }

    function scaledX(year) {
        return (year - histogram.config.initialYear) * scale + leftMargin;
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

    function scotusSizes(hist): Set<number> {
        const result = new Set();
        Object.keys(hist)
            .forEach(year => Object.keys(hist[year])
                .forEach(num => result.add(num)))
        return result;
    }

    function help(year: number, scotusSize: number): string {
        const size = histogram.histogramsByYear[year][scotusSize];
        const pctStr = formatPercent(size / histogram.simulationCount);
        return `${pctStr} of simulations have a ${scotusSize}-member court in ${year}`;
    }

    function overallStats() {
        const simYears = histogram.simulationCount * Object.keys(histogram.histogramsByYear).length;
        const hists = histogram.histogramsByYear;
        const countsBySize = new Map<number,number>();
        Object.keys(hists)
            .forEach(year =>
                Object.keys(hists[year])
                    .forEach(s => {
                        const size = Number(s);
                        const oldCount = countsBySize.get(size) ?? 0;
                        countsBySize.set(size, oldCount + hists[year][size])
                }));
        const mostCommonSizes = Array.from(countsBySize.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
        const sizeStr = mostCommonSizes.map(s => `${s[0]} (${formatPercent(s[1]/simYears)})` ).join(", ");
        return `Top court sizes: ${sizeStr}`;
    }

    function formatPercent(fraction: number): string {
        return new Intl.NumberFormat('en-us', { maximumSignificantDigits: 2 }).format(fraction*100)+"%";
    }

    /** Hack to get around Svelte bug where text isn't fully cleared */
    function updateHelpText(text: string) {
        helpText = "";
        setTimeout(() => {helpText = text}, 1);
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

    .y-tick .background {
      opacity: 0;
    }

    .y-tick:hover .background {
      fill: #b4b400;
      opacity: 15%;
    }

    .y-tick:hover text {
      stroke: #888;
    }

    .y-tick:hover line {
      stroke: #b4b400;
    }

    .svg-dot-focus {
      fill: none;
      stroke: none;
    }

    .svg-dot:hover .svg-dot-focus {
      fill: none;
      stroke: #b4b400;
      stroke-width: 2;
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

    .simulation-count {
      width: 25%;
    }

    .help {
      font-size: 12px;
      width: 25%;
      min-height: 3em; /* Keep the height from changing on mouseover. */
    }
</style>

<div style="overflow-x: scroll; width: 100%" on:mouseleave={() => updateHelpText(overallStats())}>
    <svg  width={width} height={height}>
        <g class="year-ticks">
            {#each xTicks as tick}
                <g transform="translate({scaledX(tick)}, 0)">
                    <line y1="0" y2={height - 25} x1="0" x2="0" />
                    <text y={height - 10} x="0">{tick}</text>
                </g>
            {/each}
        </g>

        <g class="y-ticks">
            {#each yTicks as tick}
                <g class="y-tick" transform="translate(0, {scaledY(tick)})">
                    <rect y="-5" x="0" width="100%" height="12" class="background" />
                    <line y1="0" y2="0" x1="14" x2={width} />
                    <text y="4" x="12">{tick}</text>
                </g>
            {/each}
        </g>

        {#each Object.keys(histogram.histogramsByYear) as year}
            {#each Object.keys(histogram.histogramsByYear[year]) as scotusSize}
                <g class="svg-dot" transform="translate({scaledX(year)}, {scaledY(scotusSize)})"
                        on:mouseover={() => updateHelpText(help(year, scotusSize))}
                        on:focus={() => updateHelpText(help(year, scotusSize))}>
                    <circle r={ 1 + ((scale-2)/2) } class="svg-dot-focus"/>
                    <circle r={(scale-2)/2} fill={color(year, scotusSize)}/>
                </g>
            {/each}
        {/each}
    </svg>
</div>

<div class="text-area status">
    <div class="simulation-count">
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
    <div class="help">
        {helpText}
    </div>
</div>
