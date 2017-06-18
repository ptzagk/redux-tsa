export default function skurt<T1>(test: (val: T1) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1>
    >) => Promise<T1[]>;

export default function skurt<T1, T2>(test: (val: T1 | T2) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2>
    >) => Promise<Array<T1 | T2>>;

export default function skurt<T1, T2, T3>(test: (val: T1 | T2 | T3) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 | PromiseLike<T3>
    >) => Promise<Array<T1 | T2 | T3>>;

export default function skurt<T1, T2, T3, T4>(test: (val: T1 | T2 | T3 | T4) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4>
    >) => Promise<Array<T1 | T2 | T3| T4>>;

export default function skurt<T1, T2, T3, T4, T5>(test: (val: T1 | T2 | T3 | T4 | T5) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4> |
        T5 |
        PromiseLike<T5>
    >) => Promise<Array<T1 | T2 | T3| T4 | T5>>;

export default function skurt<T1, T2, T3, T4, T5, T6>(test: (val: T1 | T2 | T3 | T4 | T5 | T6) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4> |
        T5 |
        PromiseLike<T5> |
        T6 |
        PromiseLike<T6>
    >) => Promise<Array<T1 | T2 | T3| T4 | T5 | T6>>;

export default function skurt<T1, T2, T3, T4, T5, T6, T7>(test: (val: T1 | T2 | T3 | T4 | T5 | T6 | T7) => boolean):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4> |
        T5 |
        PromiseLike<T5> |
        T6 |
        PromiseLike<T6> |
        T7 |
        PromiseLike<T7>
    >) => Promise<Array<T1 | T2 | T3| T4 | T5 | T6 | T7>>;

export default function skurt<T1, T2, T3, T4, T5, T6, T7, T8>(
    test: (val: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8) => boolean,
):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4> |
        T5 |
        PromiseLike<T5> |
        T6 |
        PromiseLike<T6> |
        T7 |
        PromiseLike<T7> |
        T8 |
        PromiseLike<T8>
    >) => Promise<Array<T1 | T2 | T3| T4 | T5 | T6 | T7 | T8>>;

export default function skurt<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    test: (val: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9) => boolean,
):
    (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4> |
        T5 |
        PromiseLike<T5> |
        T6 |
        PromiseLike<T6> |
        T7 |
        PromiseLike<T7> |
        T8 |
        PromiseLike<T8> |
        T9 |
        PromiseLike<T9>
    >) => Promise<Array<T1 | T2 | T3| T4 | T5 | T6 | T7 | T8 | T9>>;

export default function skurt<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    test: (val: T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10) => boolean,
) {
    return (n: number) => (ps: Iterable<
        T1 |
        PromiseLike<T1> |
        T2 |
        PromiseLike<T2> |
        T3 |
        PromiseLike<T3> |
        T4 |
        PromiseLike<T4> |
        T5 |
        PromiseLike<T5> |
        T6 |
        PromiseLike<T6> |
        T7 |
        PromiseLike<T7> |
        T8 |
        PromiseLike<T8> |
        T9 |
        PromiseLike<T9> |
        T10 |
        PromiseLike<T10>
    >): Promise<Array<T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10>> =>  {

        function runSkurt(
            test: (val: T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10) => boolean,
            n: number,
            ps: Iterable<
                T1 |
                PromiseLike<T1> |
                T2 |
                PromiseLike<T2> |
                T3 |
                PromiseLike<T3> |
                T4 |
                PromiseLike<T4> |
                T5 |
                PromiseLike<T5> |
                T6 |
                PromiseLike<T6> |
                T7 |
                PromiseLike<T7> |
                T8 |
                PromiseLike<T8> |
                T9 |
                PromiseLike<T9> |
                T10 |
                PromiseLike<T10>>,
        ): Promise<Array<T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10>> {
            return new Promise((resolve, reject) => {
                let results: Array<T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10> = [];
                for (const p of Array.from(ps)) {
                    Promise.resolve<T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10>(p)
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

        function skurtAll() {
            return Promise.all<T1 | T2 | T3 | T4 | T5| T6 | T7 | T8 | T9 | T10>(ps)
            .then((results) => results.filter(test));
        }

        if (n === Infinity) {
            return skurtAll();
        } else if (n === 0) {
            return Promise.resolve([]);
        } else {
            return Promise.race([ runSkurt(test, n, ps), skurtAll()]);
        }

    };
}
