import { generateErrorAction, isError } from "../../src/internal/utils/middleware";

import { donate, Donation } from "../example/actions";

describe("middleware utils", () => {

    describe("isError", () => {
        test("recognizes error action", () => {
            const errorAction = {
                type: "DONATE",
                error: true,
                fieldErrors: {
                    amount: [
                        "5037 is not a reasonable amount",
                        "amount must be even",
                    ],
                    name: [
                        "name must be sweet, and salty does not contain sugar",
                    ],
                },
                processErrors: {},
            };

            expect(isError(errorAction)).toBe(true);
        });

        test("recognizes normal action", () => {
            const action = donate("sugarTrain10", 650);

            expect(isError(action)).toBe(false);
        });
    });
});
