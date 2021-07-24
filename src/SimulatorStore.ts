import {writable} from "svelte/store";
import {defaultScotusConfig, ScotusConfig} from "./ScotusConfig";
import {simulate, simulateMultiple, SimulationHistogram, SimulationResult, simulationToHistogram} from "./simulate";

export interface SimulatorStoreData {
    singleSimulation: SimulationResult;
    histogram: SimulationHistogram;
    config: ScotusConfig;
}

function createSimulatorStore() {
    let config = defaultScotusConfig();
    let sampleSim = simulate(config);
    let simulationResult = simulationToHistogram(sampleSim);
    const myWorker = new Worker("build/worker.js");

    myWorker.onmessage = (e) => {
        let {histogram, singleSimulation} = e.data;
        sampleSim = singleSimulation;
        simulationResult = histogram;
        set({
            singleSimulation: sampleSim,
            config: config,
            histogram: simulationResult
        });
    };

    const updateConfig = (newConfig: ScotusConfig) => {
        if (legalConfig(newConfig)) {
            config = newConfig;
            sampleSim = simulate(config);
            simulationResult = simulationToHistogram(sampleSim);
            simulationResult = simulateMultiple(config, 1);
            set({
                singleSimulation: sampleSim,
                config: config,
                histogram: simulationResult
            });
            myWorker.postMessage(config);
        }
    };

    function legalConfig(config: ScotusConfig): boolean {
        return config.initialYear > 2020 &&
            config.endYear > config.initialYear &&
            config.averageAppointmentAge < config.averageRetirementAge &&
            config.averageAppointmentAge > 10 &&
            config.averageRetirementAge > 10;
    }

    const {subscribe, set} = writable({singleSimulation: sampleSim,
        config: config,
        histogram: simulationResult
    });

    return {
        updateConfig: updateConfig,
        subscribe
    };
}

export const simulatorStore = createSimulatorStore();