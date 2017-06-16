import { processErrorSymbol } from "../symbols";

import * as types from "../../types";

export interface GetValidatorInputInput<S, A extends types.Action, K extends keyof A> {
    action: A;
    state: S;
    fieldKey: K;
}

export function getValidatorInput<S, A extends types.Action, K extends keyof A>(
    { action, state, fieldKey }: GetValidatorInputInput<S,A,K>
): types.ValidatorInput<S, A, K> {
    return {
        action,
        state,
        fieldKey,
        field: action[fieldKey],
    };
}

interface UpdateErrorMapsInput extends types.ErrorMaps {
    fieldKey: string;
    error: types.TSAError;
}

export function buildErrorMaps(failures: types.Failure[]): types.ErrorMaps {
    const fieldErrors: types.ErrorMap = {};
    const processErrors: types.ErrorMap = {};

    function updateErrorMaps({
        fieldKey,
        error,
        fieldErrors: currentFieldErrors,
        processErrors: currentProcessErrors,
    }: UpdateErrorMapsInput ): void {
        if (typeof error !== "string" && error[processErrorSymbol]) {
            if (currentProcessErrors[fieldKey]) {
                currentProcessErrors[fieldKey].push(error);
            } else {
                currentProcessErrors[fieldKey] = [ error ];
            }
        } else {
            if (currentFieldErrors[fieldKey]) {
                currentFieldErrors[fieldKey].push(error);
            } else {
                currentFieldErrors[fieldKey] = [ error ];
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

// export function getValidator<S>(
//     validatorMap: types.ValidatorMap<S>,
//     validatorKey: string,
//     async: boolean,
// ): types.Validator<S> {
//     const syncValidator = validatorMap.sync[validatorKey];
//     const asyncValidator = validatorMap.async[validatorKey];
//     if (!syncValidator && !asyncValidator) {
//         throw Error(`${validatorKey} not found in the validatorMap`);
//     }
//     if (syncValidator && asyncValidator) {
//         throw Error(`${validatorKey} cannot be in both the syncValidatorMap and the asyncValidatorMap`);
//     }
//
//     if (asyncValidator && !async) {
//         throw Error("async process must be on to use an async validator");
//     }
//
//     return syncValidator ? syncValidator : asyncValidator;
// }
