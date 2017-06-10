import 'jest';

import syncProcess from '../src/internal/syncProcess';
import { getCheckInput } from "../src/internal/utils/process";

import validatorMap from './example/validatorMap';
import state, { State } from "./example/state";

import * as types from "../src/types";

describe("syncProcess", () => {

    describe("greenlights any action given empty validatorKeyMap", () => {
        const action = {
            type: "DONATE",
            nonsense: "blah blah"
        };

        const baseProcessInput = {
            action,
            state,
            validatorMap,
            validatorKeyMap: {}
        };

        test("binary process greenlights any action given empty validatorKeyMap", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(true);
        })

        test("infinite process greenlights any action given empty validatorKeyMap", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect(syncProcess(processInput)).toBe(true);
        })

        test("mode=1 process greenlights any action given empty validatorKeyMap", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect(syncProcess(processInput)).toBe(true);
        })
    })

    describe("greenlights conforming action", () => {
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

        test("binary process greenlights conforming action", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(true);
        });

        test("infinite process greenlights conforming action", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect(syncProcess(processInput)).toBe(true);
        })

        test("mode=1 process greenlights conforming action", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect(syncProcess(processInput)).toBe(true);
        })
    })

    describe("flags nonconforming action", () => {
        const action = {
            type: "DONATE",
            username: "franklin",
            donation: 5001,
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

        test("binary process flags nonconforming action", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: 0,
            };

            expect(syncProcess(processInput)).toBe(false);
        })

        test("infinite process flags all the faults in a nonconforming action", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: Infinity,
            };

            expect((syncProcess(processInput))).toEqual({
                fieldErrors: {
                    username: [
                        "username must be at more than 10 characters long, it is currently 8",
                        "username must be sweet, and franklin does not contain sugar"
                    ],
                    donation: [
                        "5001 is not reasonable for donation",
                        "donation must be even",
                    ]
                },
                processErrors: {}
            });
        })

        test("mode=1 process flags at most one fault per field in a nonconforming action", () => {
            const processInput: types.ProcessInput<State> = {
                ...baseProcessInput,
                mode: 1,
            };

            expect((syncProcess(processInput))).toEqual({
                fieldErrors: {
                    username: ["username must be at more than 10 characters long, it is currently 8"],
                    donation: ["5001 is not reasonable for donation"],
                },
                processErrors: {}
            });
        })
    })
})
