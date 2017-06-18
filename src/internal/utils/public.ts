import { asyncSymbol, modeSymbol, validatorMapSymbol } from "../symbols";

import * as types from "../../types";

export interface ValidateInput<S, A extends types.Action> {
    action: A;
    validatorMap: types.ValidatorMap<S, A>;
    mode?: number;
}

export function validate<S, A extends types.Action>({
    action,
    validatorMap,
    mode = Infinity,
}: ValidateInput<S, A>): A {
    const validation = {
        [asyncSymbol]: true,
        [modeSymbol]: mode,
        [validatorMapSymbol]: validatorMap,
    };
    return Object.assign({}, action, validation);
}

export interface ValidateSyncInput<S, A extends types.Action> {
    action: A;
    validatorMap: types.SyncValidatorMap<S, A>;
    mode?: number;
}

export function validateSync<S, A extends types.Action>({
    action,
    validatorMap,
    mode = Infinity,
}: ValidateSyncInput<S, A>): A {
    const validation = {
        [asyncSymbol]: false,
        [modeSymbol]: mode,
        [validatorMapSymbol]: validatorMap,
    };
    return Object.assign({}, action, validation);
}
