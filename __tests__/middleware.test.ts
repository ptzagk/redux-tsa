import "jest";
import * as Redux from "redux";

import configureReduxTSA from "../src/internal/middleware";
import { generateErrorType, validate } from "../src/internal/utils/public";
import { asyncSymbol } from "../src/internal/symbols";

import validatorMap from "./example/validatorMap";
import state, { State } from "./example/state";

import * as types from "../src/types";

describe("configureReduxTSA", () => {
    function getStore(): Redux.MiddlewareAPI<State> {
        return {
            getState: () => state,
            dispatch: jest.fn()
        };
    }

    function onError(type: any, fieldErrors: types.ErrorMap, processErrors: types.ErrorMap){
        return {
            type,
            errors: fieldErrors
        };
    }

    const middleware = configureReduxTSA({ validatorMap });

    const middlewareWithCustomOnError = configureReduxTSA({ validatorMap, onError });

    describe("non-validation actions", () => {
        test("passes an action without a validatorKeyMap to the next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "LOGIN_SUCCESS"
            };

            middleware(store)(next)(action)

            expect(next).toHaveBeenCalledWith(action);
        })
    })

    describe("sync validation", () => {

        const validatorKeyMap = {
            username: ["longerThanTen", "sweet"],
            donation: ["reasonable", "even"]
        };

        test("an action that passes sync validation is passed to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "DONATE",
                username: "sugarwater10",
                donation: 500
            };

            const validatedAction = validate({ action, validatorKeyMap });

            middleware(store)(next)(validatedAction)

            expect(next).toHaveBeenCalledWith(action)
        })

        test("an action that fails sync validation is not passed to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "DONATE",
                username: "water10",
                donation: 5001,
            };

            const validatedAction = validate({ action, validatorKeyMap });

            middleware(store)(next)(validatedAction)

            expect(next).not.toHaveBeenCalled();
        });

        test("when an action fails sync validation, an error action is dispatched", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "DONATE",
                username: "water10",
                donation: 5001,
            };

            const validatedAction = validate({ action, validatorKeyMap });

            middleware(store)(next)(validatedAction)

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("DONATE"),
                fieldErrors: {
                    username: [
                        "username must be at more than 10 characters long, it is currently 7",
                        "username must be sweet, and water10 does not contain sugar"
                    ],
                    donation: [
                        "5001 is not a reasonable donation",
                        "donation must be even",
                    ]
                },
                processErrors: {}
            })
        });

        test("onError is called with fieldErrors=null and processErrors=null when a binary process fails", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "DONATE",
                username: "water10",
                donation: 5001,
            };

            const validatedAction = validate({ action, validatorKeyMap, mode: 0 });

            middleware(store)(next)(validatedAction);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("DONATE"),
                fieldErrors: null,
                processErrors: null,
            })
        })

        test("custom onError is called when provided", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "DONATE",
                username: "water10",
                donation: 5001,
            };

            const validatedAction = validate({ action, validatorKeyMap });

            middlewareWithCustomOnError(store)(next)(validatedAction)

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("DONATE"),
                errors: {
                    username: [
                        "username must be at more than 10 characters long, it is currently 7",
                        "username must be sweet, and water10 does not contain sugar"
                    ],
                    donation: [
                        "5001 is not a reasonable donation",
                        "donation must be even",
                    ]
                },
            })
        })
    })

    describe("async validation", () => {

        const validatorKeyMap = {
            username: ["available"],
            note: ["poetic"],
        };

        test("an action that passes async validation is passed to next", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "ADD_NOTE",
                username: "grape",
                note: "less is more when more is too much",
            };

            const validatedAction = validate({
                action,
                validatorKeyMap,
                mode: 1,
                async: true,
            });

            await middleware(store)(next)(validatedAction)

            expect(next).toHaveBeenCalled();
        });

        test("an action that fails async validation is not passed to next", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "ADD_NOTE",
                username: "john",
                note: "less is chicken",
            };

            const validatedAction = validate({
                action,
                validatorKeyMap,
                mode: 1,
                async: true,
            });

            await middleware(store)(next)(validatedAction)

            expect(next).not.toHaveBeenCalled();
        });

        test("when an action fails async validation, an error action is dispatched", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "ADD_NOTE",
                username: "john",
                note: "more is chicken",
            };

            const validatedAction = validate({
                action,
                validatorKeyMap,
                mode: 1,
                async: true,
            });

            await middleware(store)(next)(validatedAction);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("ADD_NOTE"),
                fieldErrors: {
                    username: ["john is unavailable"],
                    note: ["note must be poetic: more is chicken is not poetic. less is more when more is too much is poetic"],
                },
                processErrors: {}
            });
        });
    })
})
