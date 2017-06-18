import { flatten } from "../../src/internal/utils/general";

describe("general utils", () => {

    describe("flatten", () => {
        test("flatten nested array of numbers", () => {
            const nested = [
                [1, 2, 3],
                [10, 20, 30],
                [100, 200, 300],
            ];

            const flattened = [1, 2, 3, 10, 20, 30, 100, 200, 300];

            expect(flatten(nested)).toEqual(flattened);
        });
    });
});
