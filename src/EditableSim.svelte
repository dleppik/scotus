<script lang="ts">
    import type {ScotusConfig} from "./ScotusConfig";
    import {defaultScotusConfig} from "./ScotusConfig";
    import SimulationResultGraph from "./SimulationResultGraph.svelte";
    import JusticeList from "./JusticeList.svelte";
    import {simulatorStore} from "./SimulatorStore";

    let showClearYear: boolean = false;
    let clearYear = 2050;
    let showAddIfBelow: boolean = false;
    let addBelowMin: number = 6;
    let addBelowCount: number = 3;

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

    li {
      line-height: 1.5em;
      margin: 1em 0;
    }

    .rules {
      border: 1px solid #ccc;
      box-shadow: 2px 4px 6px 2px #ccc;
      padding: 0 16px;
      width: 400px;
    }

    @media screen and (max-width: 500px) {
      .rules {
        width: 350px;
      }
    }
</style>

<div style="min-height: 200px">
    <SimulationResultGraph histogram={$simulatorStore.histogram}/>
</div>


<div style="display: flex; flex-flow: row; flex-wrap: wrap-reverse; width: 100%">
    <div>
        <h3>Example simulation</h3>
        <JusticeList justices={$simulatorStore.singleSimulation.members} />
    </div>
    <div style="position: relative; width: 400px">
        <div class="rules">
            <h2>The rules</h2>
            <p><i>You can change them!</i></p>
            <ul>
                <li>Start in <input class="yearInput" type="number" bind:value={initialYear} /></li>
                <li>End in  <input class="yearInput" type="number" bind:value={endYear} /></li>
                <li>Add <input class="singleDigit" bind:value={addPerTerm} type="number" />
                    new member{s(addPerTerm)} every
                    <input style="width: 3em" type="number" bind:value={termYears} />
                    year{s(termYears)}.</li>
                <li>Average new member appointed at age <input class="twoDigit" type="number" bind:value={averageAppointmentAge} /></li>
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
</div>

