import { asyncSymbol, modeSymbol, reduxTSASymbol, validatorKeyMapSymbol } from "../symbols";

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
