import "jest";
import * as Redux from "redux";

import createReduxTSAMiddleware from "../src/internal/middleware";
import { generateErrorType, validate, validateSync } from "../src/internal/utils/public";

import { donate, Donation, login, Login } from "./example/actions";
import { approved, poetic } from "./example/asyncValidators";
import state, { State } from "./example/state";
import { even, reasonable, sweet } from "./example/syncValidators";

import * as types from "../src/types";

describe("createReduxTSAMiddleware", () => {
    function getStore(): Redux.MiddlewareAPI<State> {
        return {
            dispatch: jest.fn(),
            getState: () => state,
        };
    }

    function onError(type: any, fieldErrors: types.ErrorMap, processErrors: types.ErrorMap) {
        return {
            type,
            errors: fieldErrors,
        };
    }

    const middleware = createReduxTSAMiddleware();

    const middlewareWithCustomOnError = createReduxTSAMiddleware(onError);

    describe("non-validation actions", () => {
        test("passes an action without a validatorKeyMap to the next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = {
                type: "LOGIN_SUCCESS",
            };

            middleware(store)(next)(action);

            expect(next).toHaveBeenCalledWith(action);
        });
    });

    describe("sync validation", () => {

        const validatorMap: types.SyncValidatorMap<State, Donation> = {
            name: [sweet],
            amount: [reasonable, even],
        };

        test("an action that passes sync validation is passed to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("sugarTrain10", 650);

            const validatedAction = validateSync({ action, validatorMap });

            middleware(store)(next)(validatedAction);

            expect(next).toHaveBeenCalledWith(action);
        });

        test("an action that fails sync validation is not passed to next", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("salty", 5037);

            const validatedAction = validateSync({ action, validatorMap });

            middleware(store)(next)(validatedAction);

            expect(next).not.toHaveBeenCalled();
        });

        test("when an action fails sync validation, an error action is dispatched", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("salty", 5037);

            const validatedAction = validateSync({ action, validatorMap });

            middleware(store)(next)(validatedAction);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("DONATE"),
                fieldErrors: {
                    amount: [
                        "5037 is not a reasonable amount",
                        "amount must be even",
                    ],
                    name: [
                        "name must be sweet, and salty does not contain sugar",
                    ],
                },
                processErrors: {},
            });
        });

        test("onError is called with fieldErrors=null and processErrors=null when a binary process fails", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("salty", 5037);

            const validatedAction = validateSync({ action, validatorMap, mode: 0 });

            middleware(store)(next)(validatedAction);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("DONATE"),
                fieldErrors: null,
                processErrors: null,
            });
        });

        test("custom onError is called when provided", () => {
            const store = getStore();
            const next = jest.fn();

            const action = donate("salty", 5037);

            const validatedAction = validateSync({ action, validatorMap });

            middlewareWithCustomOnError(store)(next)(validatedAction);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: generateErrorType("DONATE"),
                errors: {
                    name: [
                        "name must be sweet, and salty does not contain sugar",
                    ],
                    amount: [
                        "5037 is not a reasonable amount",
                        "amount must be even",
                    ],
                },
            });
        });
    });

    describe("async validation", () => {

        const validatorMap: types.ValidatorMap<State, Login> = {
            name: [approved, poetic],
            password: [approved],
        };

        test("an action that passes async validation is passed to next", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = login("sugarTrain10", "searainlake", "searainlake");

            const validatedAction = validate({ action, validatorMap });

            await middleware(store)(next)(validatedAction);

            expect(next).toHaveBeenCalled();
        });

        test("an action that fails async validation is not passed to next", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = login("grape10", "grapelake", "searain");

            const validatedAction = validate({ action, validatorMap });

            await middleware(store)(next)(validatedAction);

            expect(next).not.toHaveBeenCalled();
        });

        test("when an action fails async validation, an error action is dispatched", async () => {
            const store = getStore();
            const next = jest.fn();

            const action = login("grape10", "grapelake", "searain");

            const validatedAction = validate({ action, validatorMap });

            await middleware(store)(next)(validatedAction);

            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
