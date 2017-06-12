import { processErrorSymbol } from "../symbols";

import * as types from "types";

interface GetCheckInputInput<S> {
    action: types.Action;
    state: S;
    fieldKey: string;
}

export function getCheckInput<S>({ action, state, fieldKey }: GetCheckInputInput<S>): types.CheckInput<S> {
    return {
        action,
        state,
        fieldKey,
        field: action[fieldKey],
    };
}

export function getValidator<S>(
    validatorMap: types.ValidatorMap<S>,
    validatorKey: string,
    async: boolean,
): types.Validator<S> {
    const syncValidator = validatorMap.sync[validatorKey];
    const asyncValidator = validatorMap.async[validatorKey];
    if (!syncValidator && !asyncValidator) {
        throw Error(`${validatorKey} not found in the validatorMap`);
    }
    if (syncValidator && asyncValidator) {
        throw Error(`${validatorKey} cannot be in both the syncValidatorMap and the asyncValidatorMap`);
    }

    if (asyncValidator && !async) {
        throw Error("async process must be on to use an async validator");
    }

    return syncValidator ? syncValidator : asyncValidator;
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
