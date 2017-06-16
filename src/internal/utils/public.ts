import { asyncSymbol, modeSymbol, validatorMapSymbol } from "../symbols";

import * as types from "../../types";

export function generateErrorType(type: string): string {
    return `@@redux-tsa/${type}_ERROR`;
}

export interface ValidateInput<S, A extends types.Action> {
    action: A;
    validatorMap: types.ValidatorMap<S,A>;
    mode?: number;
    async?: boolean;
}

export function validate<S,A extends types.Action>({
    action,
    validatorMap,
    mode = Infinity,
    async = false,
}: ValidateInput<S,A>): types.Action {
    const validation = {
        [asyncSymbol]: async,
        [modeSymbol]: mode,
        [validatorMapSymbol]: validatorMap
    };
    return Object.assign({}, action, validation);
}
