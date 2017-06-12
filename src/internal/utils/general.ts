export function flatten<T>(arr: T[][]): T[] {
    return arr.reduce((res, subArr) => [...res, ...subArr ], []);
}
