<script lang="ts">
    import type {ScotusConfig} from "./ScotusConfig";
    import {defaultScotusConfig} from "./ScotusConfig";
    import SimulationResultGraph from "./SimulationResultGraph.svelte";
    import JusticeList from "./JusticeList.svelte";
    import {simulatorStore} from "./SimulatorStore";

    let showClearYear: boolean = false;
    let clearYear = 2050;
    let showAddIfBelow: boolean = false;
    let addBelowMin: number = 5;
    let addBelowCount: number = 2;

    let {initialYear, endYear, initialMembers, termYears, addPerTerm, averageAppointmentAge, averageRetirementAge} = defaultScotusConfig();
    $: {
        let config: ScotusConfig = {
            initialYear: initialYear,
            endYear: endYear,
            initialMembers: initialMembers,
            termYears: termYears,
            addPerTerm: addPerTerm,
            averageAppointmentAge: averageAppointmentAge,
            averageRetirementAge: averageRetirementAge,
        };
        if (showClearYear) {
            config.courtClearedYear = clearYear;
        }
        if (showAddIfBelow) {
            config.addIfBelow = [addBelowCount, addBelowMin];
        }
        simulatorStore.updateConfig(config);
    }

    function s(num: number): string {
        return num === 1 ? "" : "s";
    }
</script>

<style>
    .yearInput {
      width: 5em;
    }
    .singleDigit {
      width: 3em;
    }
    .twoDigit {
      width: 4em;
    }
</style>

<h1>Scotus Appointment Simulator</h1>

<p>
    Run simulations to estimate the size of the Supreme Court if appointments were made every
    {termYears} years regardless of retirements.
</p>

<div style="min-height: 300px">
    <SimulationResultGraph histogram={$simulatorStore.histogram}/>
</div>


<div style="display: flex; flex-flow: row">
    <div>
        <h3>Example simulation</h3>
        <JusticeList justices={$simulatorStore.singleSimulation.members} />
    </div>

    <div>
        <h2>The rules</h2>
        <p><i>You can change them!</i></p>
        <ul>
            <li>Start in <input class="yearInput" type="number" bind:value={initialYear} /></li>
            <li>Add <input class="singleDigit" bind:value={addPerTerm} type="number" />
                new member{s(addPerTerm)} every
                <input style="width: 3em" type="number" bind:value={termYears} />
                year{s(termYears)}.</li>
            <li>Average new member appointed at age <input class="yearInput" type="number" bind:value={averageAppointmentAge} /></li>
            <li>Average member retires at age <input type="number" class="twoDigit" bind:value={averageRetirementAge} /></li>
        </ul>
        <hr/>
        <p>Advanced rules</p>
        <ul>
            <li><input type="checkbox" bind:checked={showClearYear}/>
                Court tragedy (all justices removed) in year
                <input type="number" disabled={!showClearYear} class="yearInput" bind:value={clearYear} />
            </li>
            <li><input type="checkbox" bind:checked={showAddIfBelow}/>
                Appoint up to
                <input type="number" disabled={!showAddIfBelow} class="singleDigit" bind:value={addBelowCount} />
                per term if the court size is below
                <input type="number" disabled={!showAddIfBelow} class="singleDigit" bind:value={addBelowMin} />
                <br/>
                <i>Members are always added in the first year of the term, even in this case.</i>
            </li>
        </ul>
    </div>
</div>

