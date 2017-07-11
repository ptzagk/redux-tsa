import * as Redux from "redux";

import * as types from "../../types";

export function isTSAErrorAction<A extends Redux.Action>(
    action: types.TSAAction<A>,
): action is types.ErrorAction<A> {
    return (action as types.ErrorAction<A>).__reduxTSAError__ !== undefined;
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
}: GenerateErrorActionInput<A>): types.ErrorAction<A> {
    return {
        __reduxTSAError__: true,
        error,
        fieldErrors,
        processErrors,
        type: action.type,
    };
}
