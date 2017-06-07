import * as Redux from "redux";

import syncProcess from "./syncProcess";
import asyncProcess from "./asyncProcess";
import { asyncSymbol, modeSymbol, validatorKeyMapSymbol } from "./symbols";
import { generateErrorType } from "./utils";

import * as types from "types";

function defaultOnError(
    type: string,
    fieldErrors: types.ErrorMap,
    processErrors: types.ErrorMap,
): types.Action {
    return { type, fieldErrors, processErrors };
}

export default function configureReduxTSA({
    validatorMap,
    onError = defaultOnError,
}: types.MiddlewareConfig): Redux.Middleware {

    function generateErrorAction(
        actionType: string,
        fieldErrors: types.ErrorMap,
        processErrors: types.ErrorMap,
    ): types.Action {
        const type = generateErrorType(actionType);
        return onError(type, fieldErrors, processErrors);
    }


    return (store: Redux.MiddlewareAPI<types.State>) => (next: Redux.Dispatch<types.State>) => async (action: types.Action) => {

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


        if (action[validatorKeyMapSymbol]) {
            const processInput: types.ProcessInput = {
                action,
                validatorMap,
                mode: action[modeSymbol],
                state: store.getState(),
                validatorKeyMap: action[validatorKeyMapSymbol],
            };

            if (action[asyncSymbol]) {
                asyncProcess(processInput).then(handleOutput);
            } else {
                handleOutput(syncProcess(processInput));
            }
        } else {
            next(action);
        }
    };
}
