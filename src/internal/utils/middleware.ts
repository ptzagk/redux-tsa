import * as Redux from "redux";

import * as types from "../../types";

export interface ErrorPayload<A extends Redux.Action> {
    fieldErrors: types.ErrorMap<A> | null;
    processErrors: types.ErrorMap<A> | null;
}

export interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    type: A[T];
    error: boolean;
    payload: ErrorPayload<A>;
}

export type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

export type TSAAction<A extends Redux.Action> = A | ErrorAction<A>;

export function isError<A extends Redux.Action>(action: TSAAction<A>): action is ErrorAction<A> {
    if ((action as ErrorAction<A>).payload) {
        if ((action as ErrorAction<A>).payload.fieldErrors) {
            return (action as ErrorAction<A>).payload.fieldErrors !== undefined;
        }
    }
    return false;
}

export function generateErrorAction<A extends Redux.Action>(
    action: A,
    error: boolean,
    fieldErrors: types.ErrorMap<A> | null,
    processErrors: types.ErrorMap<A> | null,
): ErrorAction<A> {
    return {
        error,
        payload: { fieldErrors, processErrors },
        type: action.type,
    };
}
