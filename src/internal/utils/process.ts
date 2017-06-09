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

export function getValidator<S>(validatorMap: types.ValidatorMap<S>, validatorKey: string, async: boolean): types.Validator<S> {
    let validator;
    validator = validatorMap.sync[validatorKey];
    if (validator) {
        return validator;
    } else if (!async) {
        throw (`${validatorKey} is not present in the sync ValidatorMap`);
    }
    validator = validatorMap.async[validatorKey];
    if (validator) {
        return validator;
    }
    throw Error(`${validatorKey} is not present in the validatorMap`);
}

interface UpdateErrorMapsInput extends types.ErrorMaps {
    fieldKey: string,
    error: types.TSAError
};

function updateErrorMaps({
    fieldKey,
    error,
    fieldErrors,
    processErrors
}: UpdateErrorMapsInput ): types.ErrorMaps {
    if (typeof error !== "string" && error[processErrorSymbol]) {
        if (processErrors[fieldKey]) {
            processErrors[fieldKey].push(error);
        } else {
            processErrors[fieldKey] = [ error ];
        }
    } else {
        if (fieldErrors[fieldKey]) {
            fieldErrors[fieldKey].push(error);
        } else {
            fieldErrors[fieldKey] = [ error ];
        }
    }

    return { fieldErrors, processErrors };
}

export function buildErrorMaps(failures: types.Failure[]): types.ErrorMaps {
    const fieldErrors: types.ErrorMap = {};
    const processErrors: types.ErrorMap = {};

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
