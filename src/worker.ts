import type {ScotusConfig} from "./ScotusConfig";
import {simulate, simulateMultiple, SimulationHistogram, SimulationResult, simulationToHistogram} from "./simulate";

export function onmessage(e) {
    currentConfig = e.data;
    messages++;
    let delay = messages < 4 ? 3000 : 0;
    simulateSlowly(5000, delay, currentConfig)
        .catch(e => console.warn(e));
}

let messages = 0;

let currentConfig: ScotusConfig | null = null;

const delay = timeout => new Promise(resolve => {
    setTimeout(resolve, timeout);
});

async function simulateSlowly(count: number, totalDelay: number, config: ScotusConfig) {
    let startTime = new Date().getTime();
    let toDo = 1;
    let histogram = {simulationCount: 0, histogramsByYear: [], config: config};
    while (histogram.simulationCount < count && config === currentConfig) {
        histogram = simulateMultiple(config, toDo, histogram);
        if (config !== currentConfig) {
            return;
        }
        self.postMessage({
            singleSimulation: simulate(config),
            histogram: histogram,
            config: config
        });
        toDo = Math.min(count - histogram.simulationCount, toDo * 2);
        let remainingTime = new Date().getTime() - startTime;
        let delayTime = (totalDelay  - remainingTime) / 2;
        await delay(delayTime);
    }
}

self.onmessage = onmessage;