import "jest";

import { processErrorSymbol } from "../src/internal/symbols";
import syncProcess from "../src/internal/syncProcess";
import { getValidatorInput } from "../src/internal/utils/process";

import { donate, Donation } from "./example/actions";
import state, { State } from "./example/state";
import {
    confusedCheck,
    confusedError,
    even,
    reasonable,
    sweet,
} from "./example/syncValidators";

import * as types from "../src/types";

describe("syncProcess", () => {

    describe("greenlights any action given empty validatorMap", () => {
        const action = donate("frank", 10);

        const validatorMap: types.SyncValidatorMap<State, Donation> = {};

        const baseProcessInput = {
            action,
            state,
            validatorMap,
        };

        test("binary process greenlights any action given empty validatorKeyMap", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(true);
        });

        test("infinite process greenlights any action given empty validatorKeyMap", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect(syncProcess(processInput)).toBe(true);
        });

        test("mode=1 process greenlights any action given empty validatorKeyMap", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect(syncProcess(processInput)).toBe(true);
        });
    });

    describe("greenlights conforming action", () => {
        const action = donate("sugarTrain10", 650);

        const validatorMap: types.SyncValidatorMap<State, Donation> = {
            name: [sweet],
            amount: [reasonable, even],
        };

        const baseProcessInput = {
            action,
            state,
            validatorMap,
        };

        test("binary process greenlights conforming action", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(true);
        });

        test("infinite process greenlights conforming action", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect(syncProcess(processInput)).toBe(true);
        });

        test("mode=1 process greenlights conforming action", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect(syncProcess(processInput)).toBe(true);
        });
    });

    describe("flags nonconforming action", () => {
        const action = donate("salty", 5037);

        const validatorMap: types.SyncValidatorMap<State, Donation> = {
            name: [sweet],
            amount: [reasonable, even],
        };

        const baseProcessInput = {
            action,
            state,
            validatorMap,
        };

        test("binary process flags nonconforming action", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(false);
        });

        test("infinite process flags all the faults in a nonconforming action", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect((syncProcess(processInput))).toEqual({
                fieldErrors: {
                    name: [
                        "name must be sweet, and salty does not contain sugar",
                    ],
                    amount: [
                        "5037 is not a reasonable amount",
                        "amount must be even",
                    ],
                },
                processErrors: {},
            });
        });

        test("mode=1 process flags at most one fault per field in a nonconforming action", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect((syncProcess(processInput))).toEqual({
                fieldErrors: {
                    name: ["name must be sweet, and salty does not contain sugar"],
                    amount: ["5037 is not a reasonable amount"],
                },
                processErrors: {},
            });
        });
    });

    describe("non-infinite modes are lazy", () => {
        const action = donate("salty", 5037);

        function getBaseProcessInput() {
            return {
                action,
                state,
                validatorMap: {
                    name: [sweet, { check: jest.fn(), error: jest.fn() }],
                    amount: [reasonable, { check: jest.fn(), error: jest.fn() }],
                },
            };
        }

        test("binary process is lazy", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...getBaseProcessInput(),
                mode: 0,
            };

            syncProcess(processInput);

            expect(processInput.validatorMap.name![1].check).not.toBeCalled();
            expect(processInput.validatorMap.name![1].check).not.toBeCalled();

            expect(processInput.validatorMap.amount![1].check).not.toBeCalled();
            expect(processInput.validatorMap.amount![1].error).not.toBeCalled();
        });

        test("mode=1 process is lazy", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...getBaseProcessInput(),
                mode: 1,
            };

            syncProcess(processInput);

            expect(processInput.validatorMap.name![1].check).not.toBeCalled();
            expect(processInput.validatorMap.name![1].check).not.toBeCalled();

            expect(processInput.validatorMap.amount![1].check).not.toBeCalled();
            expect(processInput.validatorMap.amount![1].error).not.toBeCalled();
        });

        test("infinite process is eager", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...getBaseProcessInput(),
                mode: Infinity,
            };

            syncProcess(processInput);

            expect(processInput.validatorMap.name![1].check).toBeCalled();
            expect(processInput.validatorMap.name![1].check).toBeCalled();

            expect(processInput.validatorMap.amount![1].check).toBeCalled();
            expect(processInput.validatorMap.amount![1].error).toBeCalled();
        });
    });

    describe("external errors are handled gracefully", () => {
        const action = donate("salty", 5037);

        const validatorMap: types.SyncValidatorMap<State, Donation> = {
            name: [confusedCheck, confusedError, sweet],
            amount: [confusedCheck, reasonable, even],
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

        test("binary process fails when an external error occurs", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(false);
        });

        test("infinite process gather fieldErrors and processErrors", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect((syncProcess(processInput))).toEqual({
                fieldErrors: {
                    name: [
                        "name must be sweet, and salty does not contain sugar",
                    ],
                    amount: [
                        "5037 is not a reasonable amount",
                        "amount must be even",
                    ],
                },
                processErrors: {
                    name: [getExternalError(), getExternalError()],
                    amount: [getExternalError()],
                },
            });
        });

        test("mode=1: processErrors count toward mode error count", () => {
            const processInput: types.SyncProcessInput<State, Donation> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect(syncProcess(processInput)).toEqual({
                fieldErrors: {},
                processErrors: {
                    name: [getExternalError()],
                    amount: [getExternalError()],
                },
            });
        });
    });
});
