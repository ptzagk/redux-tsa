import 'jest';

import asyncProcess from '../src/internal/asyncProcess';
import { getCheckInput } from "../src/internal/utils/process";
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
