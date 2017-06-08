import { asyncSymbol, modeSymbol, reduxTSASymbol, validatorKeyMapSymbol } from "../symbols";

import * as types from "types";

export function generateErrorType(type: string): string {
    return `${reduxTSASymbol}/${type}_ERROR`;
}

interface ValidateInput {
    action: types.Action;
    validatorKeyMap: types.ValidatorKeyMap;
    mode: number;
    async: boolean;
}

export function validate({
    action,
    validatorKeyMap,
    mode = Infinity,
    async = false
}: ValidateInput): types.Action {
    return {
        ...action,
        [validatorKeyMapSymbol]: validatorKeyMap,
        [modeSymbol]: mode,
        [asyncSymbol]: async,
    };
}
