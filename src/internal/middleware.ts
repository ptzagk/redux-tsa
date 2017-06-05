import * as Redux from "redux";

import process from "./process";
import { modeSymbol, validatorKeyMapSymbol } from "./symbols";
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

    const normalizedValidatorMap = (function normalizedValidatorMap(): types.NormalizedValidatorMap {
        function normalizer(
            incompleteNormalizedValidatorMap: types.NormalizedValidatorMap,
            validatorKey: string,
        ): types.NormalizedValidatorMap {
            const validator = validatorMap[validatorKey];
            return {
                ...incompleteNormalizedValidatorMap,
                [validatorKey]: {
                    async check(input: types.CheckInput) {
                        return await validator.check(input);
                    },
                    error: validator.error,
                },
            };
        }

        return Object.keys(validatorMap).reduce(normalizer, {});
    })();

    function generateErrorAction(
        actionType: string,
        fieldErrors: types.ErrorMap,
        processErrors: types.ErrorMap,
    ): types.Action {
        const type = generateErrorType(actionType);
        return onError(type, fieldErrors, processErrors);
    }

    return (store: Redux.MiddlewareAPI<types.State>) => (next: Redux.Dispatch<types.State>) => async (action: types.Action) => {
        if (action[validatorKeyMapSymbol]) {
            const result = await process({
                action,
                mode: action[modeSymbol],
                state: store.getState(),
                validatorKeyMap: action[validatorKeyMapSymbol],
                validatorMap: normalizedValidatorMap,
            });

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
        } else {
            return next(action);
        }
    };
}
