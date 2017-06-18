import * as Redux from "redux";

import asyncProcess from "./asyncProcess";
import { asyncSymbol, modeSymbol, validatorMapSymbol } from "./symbols";
import syncProcess from "./syncProcess";
import { generateErrorType } from "./utils/public";

import * as types from "../types";

export interface ErrorAction extends Redux.Action {
    fieldErrors: types.ErrorMap;
    processErrors: types.ErrorMap;
}

export function defaultOnError(
    type: string,
    fieldErrors: types.ErrorMap,
    processErrors: types.ErrorMap,
): ErrorAction {
    return { type, fieldErrors, processErrors };
}

export default function configureReduxTSA(
    onError: types.OnError = defaultOnError,
): Redux.Middleware {

    function generateErrorAction(
        actionType: string,
        fieldErrors: types.ErrorMap,
        processErrors: types.ErrorMap,
    ): types.Action {
        const type = generateErrorType(actionType);
        return onError(type, fieldErrors, processErrors);
    }

    return <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) => <A extends types.Action>(action: A) => {

        function handleOutput(result: types.ProcessOutput): void {
            if (result === true) {
                next(action);
            } else {
                let fieldErrors, processErrors, errorAction;
                if (result === false) {
                    fieldErrors = processErrors = null;
                    errorAction = generateErrorAction(
                        action.type,
                        fieldErrors,
                        processErrors,
                    );
                } else {
                    ({ fieldErrors, processErrors } = result);
                    errorAction = generateErrorAction(
                        action.type,
                        fieldErrors,
                        processErrors,
                    );
                }
                store.dispatch(errorAction);
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
    };
}
