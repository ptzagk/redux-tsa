import { isTSAErrorAction } from "../../../src/internal/utils/error";

import { donate } from "../example/actions";

describe("error utils", () => {

    describe("isTSAErrorAction", () => {
        test("recognizes reduxTSAError action", () => {
            const errorAction = {
                type: "DONATE",
                error: true,
                __reduxTSAError__: true,
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

            expect(isTSAErrorAction(errorAction)).toBe(true);
        });

        test("recognizes user error action", () => {
            const errorAction = {
                type: "DONATE",
                error: true,
                __reduxTSAError: true,
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

            expect(isTSAErrorAction(errorAction)).toBe(false);
        });

        test("recognizes normal action", () => {
            const action = donate("sugarTrain10", 650);

            expect(isTSAErrorAction(action)).toBe(false);
        })
    });
});
