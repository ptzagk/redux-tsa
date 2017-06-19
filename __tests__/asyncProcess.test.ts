import "jest";

import asyncProcess from "../src/internal/asyncProcess";
import { processErrorSymbol } from "../src/internal/symbols";

import { login, Login } from "./example/actions";
import { approved, poetic } from "./example/asyncValidators";
import state, { State } from "./example/state";
import {
    available,
    confusedCheck,
    confusedError,
    longerThanTen,
    matchesPassword,
    sweet,
} from "./example/syncValidators";

import * as types from "../src/types";

describe("asyncProcess", () => {

    describe("greenlights any action given empty validatorMap", () => {

        const action = login("grape", "lighting", "blah");

        const validatorMap: types.ValidatorMap<State, Login> = {};

        const baseProcessInput = {
            action,
            state,
            validatorMap,
        };

        test("binary process greenlights any action given empty validatorMap", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                async: true,
                mode: 0,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual(true);

        });

        test("infinite process greenlights any action given empty validatorMap", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                async: true,
                mode: Infinity,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual(true);
        });

        test("mode=1 process greenlights any action given empty validatorMap", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                async: true,
                mode: 1,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual(true);
        });
    });

    describe("greenlights conforming actions", () => {

        describe("greenlights conforming action using only sync validators", () => {
            const action = login("sugarTrain10", "searainlake", "searainlake");

            const validatorMap: types.ValidatorMap<State, Login> = {
                confirm: [matchesPassword],
                name: [available, sweet],
                password: [longerThanTen],
            };

            const baseProcessInput = {
                action,
                state,
                validatorMap,
            };

            test("binary process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });

            test("infinite process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });

            test("mode=1 process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });
        });

        describe("greenlights conforming action using only async validators", () => {
            const action = login("sugarTrain10", "searainlake", "searainlake");

            const validatorMap: types.ValidatorMap<State, Login> = {
                name: [approved, poetic],
                password: [approved],
            };

            const baseProcessInput = {
                action,
                state,
                validatorMap,
            };

            test("binary process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                return expect(result).toEqual(true);
            });

            test("infinite process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });

            test("mode=1 process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });
        });

        describe("greenlights conforming action using mixed validators", () => {
            const action = login("sugarTrain10", "searainlake", "searainlake");

            const validatorMap: types.ValidatorMap<State, Login> = {
                confirm: [matchesPassword],
                name: [available, approved, poetic, sweet],
                password: [approved, longerThanTen],
            };

            const baseProcessInput = {
                action,
                state,
                validatorMap,
            };

            test("binary process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);

            });

            test("infinite process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);

            });

            test("mode=1 process greenlights conforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput);

                expect(result).toEqual(true);
            });
        });
    });

    describe("flags nonconforming actions", () => {

        describe("flags nonconforming actions using only sync validators", () => {
            const action = login("grape10", "grapelake", "searain");

            const validatorMap: types.ValidatorMap<State, Login> = {
                confirm: [matchesPassword],
                name: [available, longerThanTen, sweet],
                password: [longerThanTen],
            };

            const nameErrors = [
                "name must be more than 10 characters long, it is currently 7",
                "name must be sweet, and grape10 does not contain sugar",
            ];

            const passwordErrors = [
                "password must be more than 10 characters long, it is currently 9",
            ];

            const confirmErrors = [
                "confirm must match password",
            ];

            const baseProcessInput = {
                action,
                state,
                validatorMap,
            };

            test("binary process flags nonconforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toBe(false);
            });

            test("infinite process flags all the faults in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps<Login>;

                expect(result.fieldErrors.name).toContain(nameErrors[0]);
                expect(result.fieldErrors.name).toContain(nameErrors[1]);
                expect(result.fieldErrors.password).toContain(passwordErrors[0]);
                expect(result.fieldErrors.confirm).toContain(confirmErrors[0]);
            });

            test("mode=1 process flags at most one fault per field in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps<Login>;

                expect(result.fieldErrors.name).toHaveLength(1);
                expect(nameErrors).toContain(result.fieldErrors.name![0]);

                expect(result.fieldErrors.password).toHaveLength(1);
                expect(passwordErrors).toContain(result.fieldErrors.password![0]);

                expect(result.fieldErrors.confirm).toHaveLength(1);
                expect(confirmErrors).toContain(result.fieldErrors.confirm![0]);
            });
        });

        describe("flags nonconforming actions using only async validators", () => {
            const action = login("grape10", "grapelake", "searain");

            const validatorMap: types.ValidatorMap<State, Login> = {
                name: [approved, poetic],
                password: [approved],
            };

            const nameErrors = [
                "the authority declines the transaction",
                "name must be poetic: grape10 is not poetic",
            ];

            const passwordErrors = [
                "the authority declines the transaction",
            ];

            const baseProcessInput = {
                action,
                state,
                validatorMap,
            };

            test("binary process flags nonconforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 0,
                };

                const result = await asyncProcess(processInput);

                expect(result).toBe(false);
            });

            test("infinite process flags all the faults in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: Infinity,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps<Login>;

                expect(result.fieldErrors.name).toContain(nameErrors[0]);
                expect(result.fieldErrors.name).toContain(nameErrors[1]);
                expect(result.fieldErrors.password).toContain(passwordErrors[0]);
            });

            test("mode=1 process flags at most one fault per field in a nonconforming action", async () => {
                const processInput: types.ProcessInput<State, Login> = {
                    ...baseProcessInput,
                    mode: 1,
                };

                const result = await asyncProcess(processInput) as types.ErrorMaps<Login>;

                expect(result.fieldErrors.name).toHaveLength(1);
                expect(result.fieldErrors.name).toContain(nameErrors[0]);

                expect(result.fieldErrors.password).toHaveLength(1);
                expect(result.fieldErrors.password).toContain(passwordErrors[0]);
            });
        });
    });

    describe("flags nonconforming actions using mixed validators", async () => {
        const action = login("grape10", "grapelake", "searain");

        const validatorMap: types.ValidatorMap<State, Login> = {
            confirm: [matchesPassword],
            name: [available, approved, poetic, sweet],
            password: [approved, longerThanTen],
        };

        const nameErrors = [
            "the authority declines the transaction",
            "name must be poetic: grape10 is not poetic",
            "name must be sweet, and grape10 does not contain sugar",
        ];

        const passwordErrors = [
            "the authority declines the transaction",
            "password must be more than 10 characters long, it is currently 9",
        ];

        const confirmErrors = [
            "confirm must match password",
        ];

        const baseProcessInput = {
            action,
            state,
            validatorMap,
        };

        test("binary process flags nonconforming action", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                mode: 0,
            };

            const result = await asyncProcess(processInput);

            expect(result).toBe(false);
        });

        test("infinite process flags all the faults in a nonconforming action", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                mode: Infinity,
            };
            const result = await asyncProcess(processInput) as types.ErrorMaps<Login>;

            expect(result.fieldErrors.name).toHaveLength(3);
            expect(result.fieldErrors.name).toContain(nameErrors[0]);
            expect(result.fieldErrors.name).toContain(nameErrors[1]);
            expect(result.fieldErrors.name).toContain(nameErrors[2]);

            expect(result.fieldErrors.password).toHaveLength(2);
            expect(result.fieldErrors.password).toContain(passwordErrors[0]);
            expect(result.fieldErrors.password).toContain(passwordErrors[1]);

            expect(result.fieldErrors.confirm).toHaveLength(1);
            expect(result.fieldErrors.confirm).toContain(confirmErrors[0]);
        });

        test("mode=1 process flags at most one fault per field in a nonconforming action", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                mode: 1,
            };

            const result = await asyncProcess(processInput) as types.ErrorMaps<Login>;

            expect(result.fieldErrors.name).toHaveLength(1);
            expect(nameErrors).toContain(result.fieldErrors.name![0]);

            expect(result.fieldErrors.password).toHaveLength(1);
            expect(passwordErrors).toContain(result.fieldErrors.password![0]);

            expect(result.fieldErrors.confirm).toHaveLength(1);
            expect(confirmErrors).toContain(result.fieldErrors.confirm![0]);
        });
    });

    describe("external errors are handled gracefully", () => {
        const action = login("sugarTrain10", "searainlake", "searainlake");

        const validatorMap: types.ValidatorMap<State, Login> = {
            name: [approved, confusedCheck, confusedError, poetic ],
            password: [confusedCheck, approved],
        };

        const baseProcessInput = {
            action,
            state,
            validatorMap,
        };

        function getExternalError() {
            try {
                return `${Symbol("whoops")}`;
            } catch (e) {
                e[processErrorSymbol] = true;
                return e;
            }
        }

        test("binary process fails when an external error occurs", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                mode: 0,
            };

            const result = await asyncProcess(processInput);

            expect(result).toBe(false);
        });

        test("infinite process gather fieldErrors and processErrors", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual({
                fieldErrors: {},
                processErrors: {
                    name: [getExternalError(), getExternalError()],
                    password: [getExternalError()],
                }
            });
        });

        test("mode=1: processErrors count toward mode error count", async () => {
            const processInput: types.ProcessInput<State, Login> = {
                ...baseProcessInput,
                mode: 1,
            };

            const result = await asyncProcess(processInput);

            expect(result).toEqual({
                fieldErrors: {},
                processErrors: {
                    name: [getExternalError()],
                    password: [getExternalError()],
                },
            });
        });
    });
});
