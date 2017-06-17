import 'jest';

import asyncProcess from '../src/internal/asyncProcess';
import { getValidatorInput } from "../src/internal/utils/process";
import { processErrorSymbol } from "../src/internal/symbols";

import validatorMap from './example/validatorMap';
import state, { State } from "./example/state";

import * as types from "../src/types";

describe("asyncProcess", () => {

    describe("greenlights any action given empty validatorKeyMap", () => {
        const action = {
            type: "DONATE",
            async: true,
            nonsense: "blah blah"
        };

        const baseProcessInput = {
            action,
            state,
            validatorMap,
            validatorKeyMap: {}
        };

        test("binary process greenlights any action given empty validatorKeyMap", async () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                async: true,
                mode: 0,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual(true);

        })

        test("infinite process greenlights any action given empty validatorKeyMap", async () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                async: true,
                mode: Infinity,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual(true);
        })

        test("mode=1 process greenlights any action given empty validatorKeyMap", async () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                async: true,
                mode: 1,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual(true);
        })
    })

    describe("greenlights conforming actions", () => {
        describe("greenlights conforming action using only sync validators", () => {
            const action = {
                type: "DONATE",
                username: "sugarwater10",
                donation: 500
            };

            const validatorKeyMap = {
                username: ["longerThanTen", "sweet"],
                donation: ["reasonable", "even"]
            };

            const baseProcessInput = {
                action,
                state,
                validatorMap,
                validatorKeyMap
            };

            test("binary process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });

            test("infinite process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            })

            test("mode=1 process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: 1,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            })
        })

        describe("greenlights conforming action using only async validators", () => {
            const action = {
                type: "ADD_NOTE",
                username: "grape",
                note: "less is more when more is too much",
            };

            const validatorKeyMap = {
                username: ["available"],
                note: ["poetic"],
            };

            const baseProcessInput = {
                action,
                state,
                validatorMap,
                validatorKeyMap
            };

            test("binary process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                return expect(result).toEqual(true);
            });

            test("infinite process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            })

            test("mode=1 process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: 1,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            })
        })

        describe("greenlights conforming action using mixed validators", () => {
            const action = {
                type: "ADD_NOTE",
                username: "sugargrape12",
                donation: 550,
            };

            const validatorKeyMap = {
                username: ["sweet", "longerThanTen", "available"],
                donation: ["even", "reasonable", "approved"],
            };

            const baseProcessInput = {
                action,
                state,
                validatorMap,
                validatorKeyMap,
            };

            test("binary process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);

            });

            test("infinite process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);

            })

            test("mode=1 process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    async: true,
                    mode: 1,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);

            })
        })
    })

    describe("flags nonconforming actions", () => {

        describe("flags nonconforming actions using only sync validators", () => {
            const action = {
                type: "DONATE",
                username: "john",
                donation: 5521,
            };

            const validatorKeyMap = {
                username: ["longerThanTen", "sweet"],
                donation: ["reasonable", "even"]
            };

            const usernameErrors = [
                "username must be sweet, and john does not contain sugar",
                "username must be at more than 10 characters long, it is currently 4",
            ];

            const donationErrors = [
                "donation must be even",
                "5521 is not a reasonable donation",
            ]

            const baseProcessInput = {
                action,
                state,
                validatorMap,
                validatorKeyMap
            };

            test("binary process flags nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toBe(false);
            })

            test("infinite process flags all the faults in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps;

                expect(result.fieldErrors.username).toContain(usernameErrors[0]);
                expect(result.fieldErrors.username).toContain(usernameErrors[1]);
                expect(result.fieldErrors.donation).toContain(donationErrors[0]);
                expect(result.fieldErrors.donation).toContain(donationErrors[1]);
            })

            test("mode=1 process flags at most one fault per field in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps;

                expect(result.fieldErrors.username).toHaveLength(1);
                expect(usernameErrors).toContain(result.fieldErrors.username[0]);

                expect(result.fieldErrors.donation).toHaveLength(1);
                expect(donationErrors).toContain(result.fieldErrors.donation[0]);
            })
        })

        describe("flags nonconforming actions using only async validators", () => {
            const action = {
                type: "ADD_NOTE",
                username: "john",
                note: "more is chicken",
            };

            const validatorKeyMap = {
                username: ["available"],
                note: ["poetic"],
            };

            const usernameErrors = ["john is unavailable"];

            const noteErrors = ["note must be poetic: more is chicken is not poetic. less is more when more is too much is poetic"];

            const baseProcessInput = {
                action,
                state,
                validatorMap,
                validatorKeyMap
            };

            test("binary process flags nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toBe(false);
            })

            test("infinite process flags all the faults in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps;

                expect(result.fieldErrors.username).toContain(usernameErrors[0]);
                expect(result.fieldErrors.note).toContain(noteErrors[0]);
            });

            test("mode=1 process flags at most one fault per field in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps;

                expect(result.fieldErrors.username).toHaveLength(1);
                expect(result.fieldErrors.username).toContain(usernameErrors[0]);

                expect(result.fieldErrors.note).toHaveLength(1);
                expect(result.fieldErrors.note).toContain(noteErrors[0]);
            });
        })

        describe("flags nonconforming actions using mixed validators", async () => {
            const action = {
                type: "ADD_NOTE",
                username: "john",
                donation: 5521,
            };

            const validatorKeyMap = {
                username: ["sweet", "longerThanTen", "available"],
                donation: ["even", "reasonable", "approved"],
            };

            const usernameErrors = [
                "username must be sweet, and john does not contain sugar",
                "username must be at more than 10 characters long, it is currently 4",
                "john is unavailable"
            ];

            const donationErrors = [
                "donation must be even",
                "5521 is not a reasonable donation",
                "the authority declines the transaction"
            ]

            const baseProcessInput = {
                action,
                state,
                validatorMap,
                validatorKeyMap,
            };

            test("binary process flags nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toBe(false);
            })

            test("infinite process flags all the faults in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual({
                    fieldErrors: {
                        username: usernameErrors,
                        donation: donationErrors,
                    },
                    processErrors: {}
                });
            });

            test("mode=1 process flags at most one fault per field in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps;

                expect(result.fieldErrors.username).toHaveLength(1);
                expect(usernameErrors).toContain(result.fieldErrors.username[0]);

                expect(result.fieldErrors.donation).toHaveLength(1);
                expect(donationErrors).toContain(result.fieldErrors.donation[0]);
            });
        })
    })
})
