import { processErrorSymbol } from "../symbols";

import * as types from "types";

interface ErrorCountInput extends types.ErrorMaps {
    fieldKey: string;
}

export function errorCount({
    fieldKey,
    fieldErrors,
    processErrors
}: ErrorCountInput): number {
    let fieldErrorCount, processErrorCount;

    if (fieldErrors[fieldKey]) {
        fieldErrorCount = fieldErrors[fieldKey].length;
    } else {
        fieldErrorCount = 0;
    }

    if (processErrors[fieldKey]) {
        processErrorCount = processErrors[fieldKey].length;
    } else {
        processErrorCount = 0;
    }

    return fieldErrorCount + processErrorCount;
}

interface GetCheckInputInput<S> {
    action: types.Action;
    state: S;
    fieldKey: string;
}

export function getCheckInput<S>({ action, state, fieldKey }: GetCheckInputInput<S>): types.CheckInput {
    return {
        action,
        state,
        fieldKey,
        field: action[fieldKey],
    };
}

export function getValidator<S>(validatorMap: types.ValidatorMap<S>, validatorKey: string): types.Validator<S> {
    let validator;
    validator = validatorMap.sync[validatorKey];
    if (validator) {
        return validator;
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

export function updateErrorMaps({
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

export function isEmpty(errorMap: types.ErrorMap): boolean {
    return Boolean(Object.keys(errorMap).length);
}
