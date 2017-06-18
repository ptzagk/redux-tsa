import * as Redux from "redux";

import * as types from "../../types";

export interface ErrorPayload<A extends Redux.Action> {
    fieldErrors: types.ErrorMap<A> | null;
    processErrors: types.ErrorMap<A> | null;
}

export interface ErrorAction<A extends Redux.Action> {
    type: any;
    error: boolean;
    payload: ErrorPayload<A>;
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
