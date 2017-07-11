import * as Redux from "redux";

import asyncProcess from "./asyncProcess";
import { asyncSymbol, modeSymbol, validatorMapSymbol } from "./symbols";
import syncProcess from "./syncProcess";
import { generateErrorAction } from "./utils/error";

import * as types from "../types";

export default <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) =>
    <A extends types.AnyAction>(action: A) => {

        function handleOutput(output: types.ProcessOutput<A>) {
            if (output === true) {
                return next(action);
            } else {
                let fieldErrors, processErrors, errorAction;
                if (output === false) {
                    fieldErrors = processErrors = null;
                } else {
                    ({ fieldErrors, processErrors } = output);
                }
                errorAction = generateErrorAction({
                    action,
                    fieldErrors,
                    processErrors,
                    error: true,
                });
                return next(errorAction);
            }
        }

        if (action[validatorMapSymbol]) {
            const processInput = {
                action,
                mode: action[modeSymbol] as number,
                state: store.getState(),
                validatorMap: action[validatorMapSymbol],
            };

            if (action[asyncSymbol]) {
                return asyncProcess(processInput).then(handleOutput);
            } else {
                return handleOutput(syncProcess(processInput));
            }
        } else {
            return next(action);
        }
};
