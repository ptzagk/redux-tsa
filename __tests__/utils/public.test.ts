import { generateErrorType, validate } from "../../src/internal/utils/public";
import { asyncSymbol, modeSymbol, validatorKeyMapSymbol } from "../../src/internal/symbols";

import * as types from "types";

describe("public utils", () => {

    describe("generateErrorType", () => {

        test("generates error type", () => {
            expect(generateErrorType("ADD_NOTE")).toBe("@@redux-tsa/ADD_NOTE_ERROR");;
        });
    });

    describe("validate", () => {
        const action: types.Action = {
            type: "LOGIN",
            username: "bill",
            password: "12george15chickenbaconranch"
        };

        const validatorKeyMap: types.ValidatorKeyMap = {
            username: ["unique", "magical"],
            password: ["mixed", "long", "magical"]
        };

        test("async defaults to false", () => {
            expect(validate({ action, validatorKeyMap })[asyncSymbol]).toBe(false);
        });

        test("mode defaults to Infinity", () => {
            expect(validate({ action, validatorKeyMap })[modeSymbol]).toBe(Infinity);
        });

        test("augments given action with validation keys", () => {
            expect(validate({
                action,
                validatorKeyMap,
                mode: 0,
                async: true
            })).toEqual({
                ...action,
                [validatorKeyMapSymbol]: validatorKeyMap,
                [modeSymbol]: 0,
                [asyncSymbol]: true
            });
        });
    });
})
