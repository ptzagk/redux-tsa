import * as Redux from "redux";

import asyncProcess from "./asyncProcess";
import { asyncSymbol, modeSymbol, validatorMapSymbol } from "./symbols";
import syncProcess from "./syncProcess";
import { generateErrorAction } from "./utils/middleware";

import * as types from "../types";

export default <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) =>
    <A extends types.Action>(action: A) => {

    function handleOutput(result: types.ProcessOutput<A>): void {
        if (result === true) {
            next(action);
        } else {
            let fieldErrors, processErrors, errorAction;
            if (result === false) {
                fieldErrors = processErrors = null;
            } else {
                ({ fieldErrors, processErrors } = result);
            }
            errorAction = generateErrorAction(action, true, fieldErrors, processErrors);
            next(errorAction);
        }
    }

    if (action[validatorMapSymbol]) {
        const processInput: types.ProcessInput<S, A> = {
            action,
            mode: action[modeSymbol] as number,
            state: store.getState(),
            validatorMap: action[validatorMapSymbol] as types.ValidatorMap<S, A>,
        };

        if (action[asyncSymbol]) {
            return asyncProcess(processInput).then(handleOutput);
        } else {
            handleOutput(syncProcess(processInput));
        }
    } else {
        next(action);
    }
}
;
