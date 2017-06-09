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

    test("throws error if validatorKey not found in SyncValidatorMap", () => {

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

        expect(() => (syncProcess(processInput))).toThrow();
    });

    test("returns true given a valid action", () => {

        const validatorKeyMap = {
            note: ["longerThanTen"],
            amount: ["reasonable"]
        }

        const processInput: types.ProcessInput<State> = {
            action,
            state,
            mode: Infinity,
            validatorMap,
            validatorKeyMap
        };

        expect(syncProcess(processInput)).toBe(true);
    });

    test("returns a complete")

})
