import type {Justice, ScotusConfig} from "./ScotusConfig";

export interface SimulationHistogram {
    simulationCount: number;
    histogramsByYear: number[][];
    config: ScotusConfig;
}

export interface SimulationResult {
    yearToSize: Map<number, number>;
    members: Justice[];
    config: ScotusConfig;
}

/** Returns a sparse matrix of SCOTUS sizes indexed by year. */
export function simulate(config: ScotusConfig): SimulationResult {
    const {initialYear, endYear, initialMembers, termYears, averageRetirementAge, addPerTerm, averageAppointmentAge, courtClearedYear} = config;
    let ageRand = gaussianGenerator(averageAppointmentAge, 4);
    let retireRand = gaussianGenerator(averageRetirementAge, 5);
    let initialRetirementMin = initialYear + 2  - (initialYear % 2);
    let members: Justice[] = initialMembers.map(m => { return {
        ...m,
        retiredYear:retirement(retireRand, averageRetirementAge, initialRetirementMin, m.birthYear)}
    });
    let allMembers = [...members];

    let sizeByYear = new Map<number,number>();
    for (let year = initialYear; year <= endYear; year++) {
        // Retirements
        members = members.filter(m => m.retiredYear > year);

        // Additions
        if (year % termYears === 0) {
            let addThisTerm = addPerTerm;
            if (config.addIfBelow) {
                const [minBelowToAdd, minBelowSize] = config.addIfBelow;
                const needed = minBelowSize - members.length;
                if (needed > 0) {
                    addThisTerm = Math.min(needed, minBelowToAdd);
                }
            }
            for (let i=0; i < addThisTerm; i++) {
                const aa = ageRand();
                const memberBirthYear = year - Math.round(aa);
                const newMember = {
                    birthYear: memberBirthYear,
                    appointedYear: year,
                    retiredYear: retirement(retireRand, averageRetirementAge, year, memberBirthYear, courtClearedYear)
                };
                members.push(newMember);
                allMembers.push(newMember);
            }
        }
        sizeByYear.set(year, members.length);
    }
    return {yearToSize: sizeByYear, members: allMembers, config: config};
}

function retirement(retireRand, averageRetirementAge: number, minYear: number, birthYear: number, courtClearedYear?: number): number {
    let retired = 0;
    let maxTries = 10;
    while (retired < minYear) {
        if (maxTries-- === 0) {
            retired = Math.max(minYear, birthYear + averageRetirementAge);
            break;
        }
        retired = Math.round(birthYear + retireRand());
    }
    if (Number.isFinite(courtClearedYear) && courtClearedYear >= minYear && courtClearedYear < retired) {
        return courtClearedYear;
    }
    return retired;
}

/** Return an array of simulation result histograms. The outer array is indexed by year. Each inner array
 * is indexed by SCOTUS size and contains a count of simulations which match that size. Thus, result[2035][8] is
 * the number of simulations in which SCOTUS had 8 members at the end of 2035.
 */
export function simulateMultiple(config: ScotusConfig, count: number, histogram?: SimulationHistogram): SimulationHistogram {
    if ( ! histogram) {
        histogram = {simulationCount: 0, histogramsByYear: [], config: config};
    }
    for (let i=0; i<count; i++) {
        simulationToHistogram(simulate(config), histogram);
    }
    return histogram;
}

/** Note that this modifies histogram. */
export function simulationToHistogram(simResult: SimulationResult, histogram?: SimulationHistogram) {
    if ( ! histogram) {
        histogram = {simulationCount: 0, histogramsByYear: [], config: simResult.config};
    }
    const {histogramsByYear} = histogram;
    for (const yearCount of simResult.yearToSize) {
        const [year, count] = yearCount;
        const counts = histogramsByYear[year] ?? [];
        const oldCount = counts[count] ?? 0;
        counts[count] = oldCount + 1;
        histogramsByYear[year] = counts;
    }
    histogram.simulationCount++;
    return histogram;
}

export function gaussianHistogram(mean: number, stdev: number, count: number): number[] {
    const gauss = gaussianGenerator(mean, stdev);
    const histogram: number[] = [];
    for (let i=0; i<count; i++) {
        let num = Math.round(gauss());
        const oldCount = histogram[num] || 0;
        histogram[num] = oldCount + 1;
    }
    return histogram;
}

// returns a gaussian random function with the given mean and stdev.
// Marsaglia polar method, from https://stackoverflow.com/a/35599181/18078
function gaussianGenerator(mean: number, stdev: number): () => number {
    let y2;
    let useLast = false;
    return function() {
        let y1;
        if (useLast) {
            y1 = y2;
            useLast = false;
        } else {
            let x1, x2, w;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            useLast = true;
        }

        const result = mean + stdev * y1;
        if (result > 0)
            return result;
        return -result;
    }
}