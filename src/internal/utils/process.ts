import { processErrorSymbol } from "../symbols";

import * as types from "../../types";

export interface GetValidatorInputInput<S, A extends types.AnyAction, K extends keyof A> {
    action: A;
    state: S;
    fieldKey: K;
}

export function getValidatorInput<S, A extends types.AnyAction, K extends keyof A>(
    { action, state, fieldKey }: GetValidatorInputInput<S, A, K>,
): types.ValidatorInput<S, A, K> {
    return {
        action,
        state,
        fieldKey,
        field: action[fieldKey],
    };
}

interface UpdateErrorMapsInput<A extends types.AnyAction> extends types.ErrorMaps<A> {
    fieldKey: string;
    error: types.InternalTSAError;
}

export function buildErrorMaps<A extends types.AnyAction>(failures: types.Failure[]): types.ErrorMaps<A> {
    const fieldErrors: types.ErrorMap<A> = {};
    const processErrors: types.ErrorMap<A> = {};

    function updateErrorMaps({
        fieldKey,
        error,
        fieldErrors: currentFieldErrors,
        processErrors: currentProcessErrors,
    }: UpdateErrorMapsInput<A> ): void {
        if (typeof error !== "string" && error[processErrorSymbol]) {
            if (currentProcessErrors![fieldKey]) {
                currentProcessErrors![fieldKey]!.push(error as types.TSAError);
            } else {
                currentProcessErrors![fieldKey] = [ error as types.TSAError ];
            }
        } else {
            if (currentFieldErrors![fieldKey]) {
                currentFieldErrors![fieldKey]!.push(error);
            } else {
                currentFieldErrors![fieldKey] = [ error ];
            }
        }
    }

    for (const { fieldKey, error } of failures) {
        updateErrorMaps({
            fieldKey,
            error,
            fieldErrors,
            processErrors,
        });
    }

    return { fieldErrors, processErrors };
}
