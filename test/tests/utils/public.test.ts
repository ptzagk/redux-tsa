import { asyncSymbol, modeSymbol, validatorMapSymbol } from "../../../src/internal/symbols";
import { validate, validateSync } from "../../../src/internal/utils/public";

import { donate, Donation, login, Login } from "../example/actions";
import { approved, poetic } from "../example/asyncValidators";
import state, { State } from "../example/state";
import {
    even,
    reasonable,
    sweet,
} from "../example/syncValidators";

import * as types from "../../../src/types";

describe("public utils", () => {

    describe("validate", () => {
        const action = login("sugarTrain10", "searainlake", "searainlake");

        const validatorMap: types.ValidatorMap<State, Login> = {
            name: [approved, poetic],
            password: [approved],
        };

        const validatedAction = validate({ action, validatorMap });

        test("async is set to true", () => {
            const validatedAction: types.AnyAction = validate({ action, validatorMap });
            expect(validatedAction[asyncSymbol]).toBe(true);
        });

        test("mode defaults to Infinity", () => {
            const validatedAction: types.AnyAction = validate({ action, validatorMap });
            expect(validatedAction[modeSymbol]).toBe(Infinity);
        });

        test("augments given action with validation input", () => {
            const validatedAction: types.AnyAction = validate({ action, validatorMap, mode: 0 });
            expect(validatedAction).toEqual({
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

        test("async is set to false", () => {
            const validatedAction: types.AnyAction = validateSync({ action, validatorMap });
            expect(validatedAction[asyncSymbol]).toBe(false);
        });

        test("mode defaults to Infinity", () => {
            const validatedAction: types.AnyAction = validateSync({ action, validatorMap });
            expect(validatedAction[modeSymbol]).toBe(Infinity);
        });

        test("augments given action with validation input", () => {
            const validatedAction: types.AnyAction = validateSync({ action, validatorMap, mode: 0 });
            expect(validatedAction).toEqual({
                ...action,
                [validatorMapSymbol]: validatorMap,
                [modeSymbol]: 0,
                [asyncSymbol]: false,
            });
        });
    });
});
