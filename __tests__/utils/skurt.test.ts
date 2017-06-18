import skurt from "../../src/internal/utils/skurt";

describe("skurt", () => {

    const ps = [
        Promise.resolve(162),
        Promise.resolve(300),
        Promise.resolve(100),
        Promise.resolve(5607),
        Promise.resolve(100),
        Promise.resolve(13),
        Promise.resolve(3945),
        Promise.resolve(100),
        Promise.resolve(39292929),
    ];

    test("number of results", async () => {
        function hundreds(a: number): boolean {
            return a === 100;
        }

        const getHundreds = skurt(hundreds);

        const noHundreds = await getHundreds(0)(ps);
        const oneHundreds = await getHundreds(1)(ps);
        const twoHundreds = await getHundreds(2)(ps);
        const threeHundreds = await getHundreds(3)(ps);
        const allHundreds = await getHundreds(Infinity)(ps);

        expect(noHundreds).toEqual([]);
        expect(oneHundreds).toEqual([100]);
        expect(twoHundreds).toEqual([100, 100]);
        expect(threeHundreds).toEqual([100, 100, 100]);
        expect(allHundreds).toEqual([100, 100, 100]);

    });

    test("returns as many winners...", async () => {

        function magic(a: number): boolean {
            return a === 123456789;
        }

        const getMagic = skurt(magic);

        const oneNothing = await getMagic(1)(ps);
        const twoNothing = await getMagic(2)(ps);
        const threeNothing = await getMagic(3)(ps);

        expect(oneNothing).toEqual([]);
        expect(twoNothing).toEqual([]);
        expect(threeNothing).toEqual([]);
    });
});
