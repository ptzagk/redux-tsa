import { processErrorSymbol } from "../../src/internal/symbols";
import { buildErrorMaps, getValidatorInput } from "../../src/internal/utils/process";

import { donate, Donation } from "../example/actions";
import state from "../example/state";

import * as types from "../../src/types";

describe("process utils", () => {

    describe("getValidatorInput", () => {
        test("produces validatorInput", () => {
            const action: types.Action  = {
                type: "ADD_NOTE",
                note: "less is more if more is too much",
            };

            expect(getValidatorInput({ action, state, fieldKey: "amount"})).toEqual({
                action,
                state,
                fieldKey: "amount",
                field: action.amount,
            });
        });
    });

    describe("buildErrorMaps", () => {
        test("builds ErrorMaps", () => {
            const networkError: types.InternalTSAError = Error("server did not respond");
            networkError[processErrorSymbol] = true;

            const failures: types.Failure[] = [
                {
                    fieldKey: "username",
                    error: Error("username is goofy"),
                },
                {
                    fieldKey: "username",
                    error: "username is taken",
                },
                {
                    fieldKey: "username",
                    error: networkError,
                },
                {
                    fieldKey: "email",
                    error: "email is goofy",
                },
                {
                    fieldKey: "email",
                    error: networkError,
                },
                {
                    fieldKey: "password",
                    error: "must be ten characters",
                },
            ];

            const errorMaps = {
                fieldErrors: {
                    username: [ Error("username is goofy"), "username is taken"],
                    email: ["email is goofy"],
                    password: ["must be ten characters"],
                },
                processErrors: {
                    username: [networkError],
                    email: [networkError],
                },
            };

            expect(buildErrorMaps(failures)).toEqual(errorMaps);
        });
    });
});
