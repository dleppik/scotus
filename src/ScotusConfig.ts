export interface ScotusConfig {
    initialYear: number,
    endYear: number,
    initialMembers: Justice[],
    termYears: number,
    addPerTerm: number,
    addIfBelow?: [number, number], // e.g. add 2 members if below 7
    courtClearedYear?: number,
    averageRetirementAge: number,
    averageAppointmentAge: number
}

export interface Justice {
    birthYear: number;
    appointedYear: number;
    name?: string;
    retiredYear?: number;
}

export function defaultScotusConfig(): ScotusConfig {
    return {
        initialYear: 2025,
        endYear: 2125,
        initialMembers: [
            {birthYear: 1955, appointedYear: 2005, name: "Roberts"},
            {birthYear: 1948, appointedYear: 1991, name: "Thomas"},
            {birthYear: 1938, appointedYear: 1994, name: "Breyer"},
            {birthYear: 1950, appointedYear: 2006, name: "Alito"},
            {birthYear: 1954, appointedYear: 2009, name: "Sotomayor"},
            {birthYear: 1960, appointedYear: 2010, name: "Kagan"},
            {birthYear: 1967, appointedYear: 2017, name: "Gorsuch"},
            {birthYear: 1965, appointedYear: 2018, name: "Kavanaugh"},
            {birthYear: 1972, appointedYear: 2020, name: "Barrett"},
        ],
        termYears: 4,
        addPerTerm: 1,
        averageRetirementAge: 85,
        averageAppointmentAge: 50 // Should be 50
    };
}