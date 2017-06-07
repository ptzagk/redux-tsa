import {
    asyncSymbol,
    modeSymbol,
    reduxTSASymbol,
    processErrorSymbol,
    validatorKeyMapSymbol
} from "./symbols";

import * as types from "types";

export function generateErrorType(type: string): string {
    return `${reduxTSASymbol}/${type}_ERROR`;
}

export function validate(
    action: types.Action,
    validatorKeyMap: types.ValidatorKeyMap,
    mode: number = Infinity,
    async: boolean = false,
): types.Action {

    return {
        ...action,
        [validatorKeyMapSymbol]: validatorKeyMap,
        [modeSymbol]: mode,
        [asyncSymbol]: async,
    };
}

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

interface GetCheckInputInput {
    action: types.Action;
    state: types.State;
    fieldKey: string;
}

export function getCheckInput({ action, state, fieldKey }: GetCheckInputInput): types.CheckInput {
    return {
        action,
        state,
        fieldKey,
        field: action[fieldKey],
    };
}

export function getValidator(validatorMap: types.ValidatorMap, validatorKey: string): types.Validator {
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
