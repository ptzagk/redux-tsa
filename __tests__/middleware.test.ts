import "jest";
import * as Redux from "redux";

import configureReduxTSA from "../src/internal/middleware";
import { generateErrorType, validate } from "../src/internal/utils/public";

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

    test("passed an action without a validatorKeyMap to the next", () => {
        const store = getStore();
        const next = jest.fn();

        const action = {
            type: "LOGIN_SUCCESS"
        };

        middleware(store)(next)(action)

        expect(next).toHaveBeenCalledWith(action);
    })

    test("an action that passes validation is passed to next", () => {
        const store = getStore();
        const next = jest.fn();

        const action = {
            type: "DONATE",
            username: "sugarwater10",
            donation: 500
        };

        const validatorKeyMap = {
            username: ["longerThanTen", "sweet"],
            donation: ["reasonable", "even"]
        };

        const validatedAction = validate({ action, validatorKeyMap });

        middleware(store)(next)(validatedAction)

        expect(next).toHaveBeenCalledWith(action)
    })

    test("an action that fails validation is not passed to next", () => {
        const store = getStore();
        const next = jest.fn();

        const action = {
            type: "DONATE",
            username: "water10",
            donation: 5001,
        };

        const validatorKeyMap = {
            username: ["longerThanTen", "sweet"],
            donation: ["reasonable", "even"]
        };

        const validatedAction = validate({ action, validatorKeyMap });

        middleware(store)(next)(validatedAction)

        expect(next).not.toHaveBeenCalled();
    });

    test("when an action fails validation, an error action is dispatched", () => {
        const store = getStore();
        const next = jest.fn();

        const action = {
            type: "DONATE",
            username: "water10",
            donation: 5001,
        };

        const validatorKeyMap = {
            username: ["longerThanTen", "sweet"],
            donation: ["reasonable", "even"]
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
                    "5001 is not reasonable for donation",
                    "donation must be even",
                ]
            },
            processErrors: {}
        })
    });
})
