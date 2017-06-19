import * as Redux from "redux";

import * as types from "../../types";

export interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    __reduxTSAError__: boolean;
    type: A[T];
    error: boolean;
    fieldErrors: types.ErrorMap<A> | null;
    processErrors: types.ErrorMap<A> | null;
}

export type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

export type TSAAction<A extends Redux.Action> = A | ErrorAction<A>;

export function isError<A extends Redux.Action>(action: TSAAction<A>): action is ErrorAction<A> {
    return (action as ErrorAction<A>).__reduxTSAError__ !== undefined;
}

export interface GenerateErrorActionInput<A extends Redux.Action> {
    action: A;
    error: boolean;
    fieldErrors: types.ErrorMap<A> | null;
    processErrors: types.ErrorMap<A> | null;
}

export function generateErrorAction<A extends Redux.Action>({
    action,
    error,
    fieldErrors,
    processErrors,
}: GenerateErrorActionInput<A>): ErrorAction<A> {
    return {
        __reduxTSAError__: true,
        error,
        fieldErrors,
        processErrors,
        type: action.type,
    };
}
