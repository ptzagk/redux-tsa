import { modeSymbol, reduxTSASymbol, validatorKeyMapSymbol  } from "./symbols";

import * as types from "types";

export function generateErrorType(type: string): string {
    return `${reduxTSASymbol}/${type}_ERROR`;
}

export function validate(
    action: types.Action,
    validatorKeyMap: types.ValidatorKeyMap,
    mode: number = Infinity,
): types.Action {

    return {
        ...action,
        [validatorKeyMapSymbol]: validatorKeyMap,
        [modeSymbol]: mode,
    };
}

export function normalizeValidatorMap(validatorMap: types.ValidatorMap): types.NormalizedValidatorMap {
        function normalizer(
            incompleteNormalizedValidatorMap: types.NormalizedValidatorMap,
            validatorKey: string,
        ): types.NormalizedValidatorMap {
            const validator = validatorMap[validatorKey];
            return {
                ...incompleteNormalizedValidatorMap,
                [validatorKey]: {
                    check(input: types.CheckInput) {
                        return Promise.resolve(validator.check(input));
                    },
                    error: validator.error,
                },
            };
        }

        return Object.keys(validatorMap).reduce(normalizer, {});
    }
