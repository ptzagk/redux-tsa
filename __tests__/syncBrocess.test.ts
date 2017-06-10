import 'jest';

import syncProcess from '../src/internal/syncProcess';
import { getCheckInput } from "../src/internal/utils/process";

import validatorMap from './example/validatorMap';
import state, { State } from "./example/state";

import * as types from "../src/types";

describe("syncProcess", () => {
    const action: types.Action = {
        type: "ADD_NOTE",
        note: "less is more when more is too much",
        amount: 650
    };

    test("does not let a syncProcess use an async validator", () => {
        const action: types.Action = {
            type: "ADD_NOTE",
            note: "less is more when more is too much",
            amount: 650
        };

        const validatorKeyMap = {
            note: ["poetic"]
        }

        const processInput: types.ProcessInput<State> = {
            action,
            state,
            mode: Infinity,
            validatorMap,
            validatorKeyMap
        };

        expect(() => (syncProcess(processInput)))
            .toThrowError('async process must be on to use an async validator');
    });

    test("validatorKey must correspond to to a key in the validatorMap", () => {
        const action: types.Action = {
            type: "ADD_NOTE",
            note: "less is more when more is too much",
            amount: 650
        };

        const validatorKeyMap = {
            note: ["magical"]
        };

        const processInput: types.ProcessInput<State> = {
            action,
            state,
            mode: Infinity,
            validatorMap,
            validatorKeyMap
        };

        expect(() => (syncProcess(processInput)))
            .toThrowError('magical not found in the validatorMap');
    });

    //
    // test("binaryProcess succeeds")
    //
    // test("binaryProcess fails")
    //
    // test("Infinite process succeeds")
    //
    // test("Infinite process fails")
    //
    // test("mode=1 process succeeds")
    //
    // test("mode=1 process fails")
    //
    // test("mode=3 process succeeds")
    //
    // test("mode=3 process fails")

    // test("throws error if validatorKey not found in SyncValidatorMap", () => {
    //
    //     const validatorKeyMap = {
    //         note: ["poetic"]
    //     }
    //
    //     const processInput: types.ProcessInput<State> = {
    //         action,
    //         state,
    //         mode: Infinity,
    //         validatorMap,
    //         validatorKeyMap
    //     };
    //
    //     expect(() => (syncProcess(processInput))).toThrow();
    // });

    // test("returns true given a valid action", () => {
    //
    //     const validatorKeyMap = {
    //         note: ["longerThanTen"],
    //         amount: ["reasonable"]
    //     }
    //
    //     const processInput: types.ProcessInput<State> = {
    //         action,
    //         state,
    //         mode: Infinity,
    //         validatorMap,
    //         validatorKeyMap
    //     };
    //
    //     expect(syncProcess(processInput)).toBe(true);
    // });
    //
    // test("returns a complete")

})
