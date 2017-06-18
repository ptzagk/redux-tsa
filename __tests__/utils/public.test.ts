import { asyncSymbol, modeSymbol, validatorMapSymbol } from "../../src/internal/symbols";
import { generateErrorType, validate, validateSync } from "../../src/internal/utils/public";

import { donate, Donation, login, Login } from "../example/actions";
import { approved, poetic } from "../example/asyncValidators";
import state, { State } from "../example/state";
import {
    even,
    reasonable,
    sweet,
} from "../example/syncValidators";

import * as types from "types";

describe("public utils", () => {

    describe("generateErrorType", () => {

        test("generates error type", () => {
            expect(generateErrorType("ADD_NOTE")).toBe("@@redux-tsa/ADD_NOTE_ERROR");
        });
    });

    describe("validate", () => {
        const action = login("sugarTrain10", "searainlake", "searainlake");

        const validatorMap: types.ValidatorMap<State, Login> = {
            name: [approved, poetic],
            password: [approved],
        };

        const validatedAction: types.Action = validate({ action, validatorMap });

        test("async is set to true", () => {
            expect(validatedAction[asyncSymbol]).toBe(true);
        });

        test("mode defaults to Infinity", () => {
            expect(validatedAction[modeSymbol]).toBe(Infinity);
        });

        test("augments given action with validation input", () => {
            expect(validate({ action, validatorMap, mode: 0 })).toEqual({
                ...action,
                [validatorMapSymbol]: validatorMap,
                [modeSymbol]: 0,
                [asyncSymbol]: true,
            });
        });
    });

    describe("validateSync", () => {
        const action = donate("sugarTrain10", 650);

        const validatorMap: types.SyncValidatorMap<State, Donation> = {
            name: [sweet],
            amount: [reasonable, even],
        };

        const validatedAction: types.Action = validateSync({ action, validatorMap });

        test("async is set to false", () => {
            expect(validatedAction[asyncSymbol]).toBe(false);
        });

        test("mode defaults to Infinity", () => {
            expect(validatedAction[modeSymbol]).toBe(Infinity);
        });

        test("augments given action with validation input", () => {
            expect(validateSync({ action, validatorMap, mode: 0 })).toEqual({
                ...action,
                [validatorMapSymbol]: validatorMap,
                [modeSymbol]: 0,
                [asyncSymbol]: false,
            });
        });
    });
});
