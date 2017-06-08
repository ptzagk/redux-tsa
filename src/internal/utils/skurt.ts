type Test = <A>(val: any) => A | false

function skurt<A, B>(test: Test, n: number, ps: Iterable<Promise<A>>): Promise<B[]> {
    return new Promise((resolve, reject) => {
        let results: any[] = [];
        for (const p of Array.from(ps)) {
            p
            .then((result) => {
                if (test(result)) {
                    results = [...results, result];
                }
                if (results.length === n) {
                    resolve(results);
                }
            })
            .catch(reject);
        }
    });
}

export default <B>(test: Test) => (n: number) => <A>(ps: Iterable<Promise<A>>): Promise<B[]> =>  {
    return Promise.race(
        [
            skurt(test, n, ps),
            Promise.all(ps).then(results => results.filter(test))
        ])
        .then(results => results.slice(0, n));
}
