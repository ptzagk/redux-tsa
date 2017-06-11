import { processErrorSymbol } from "./symbols";
import { getValidator, getCheckInput,  buildErrorMaps } from "./utils/process";

import * as types from "types";

export default function process<S>({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput<S>): types.ProcessOutput {

    function binaryProcess(): types.ProcessOutput {
        for (const fieldKey of Object.keys(validatorKeyMap)) {
            const checkInput = getCheckInput({action, state, fieldKey });
            for (const validatorKey of validatorKeyMap[fieldKey]) {
                const { check } = getValidator(validatorMap,validatorKey, false);
                try {
                    if (!check(checkInput)) {
                        return false;
                    }
                } catch(e) {
                    return false;
                }

            }
        }
        return true;
    }

    function normalProcess(): types.ProcessOutput {
            function getResult(
                { check, error }: types.Validator<S>,
                fieldKey: string,
                checkInput: types.CheckInput<S>,
            ): types.ValidationResult {
                let checkOutout, producedError;
                try {
                    checkOutout = check(checkInput)
                } catch(e) {
                    e[processErrorSymbol] = true;
                    producedError = e;
                }
                if (!producedError && (checkOutout !== true)) {
                    let context;
                    if (checkOutout === false) {
                        context = {};
                    } else {
                        context = checkOutout;
                    }
                    try {
                        producedError = error({ ...checkInput, context });
                    } catch(e) {
                        e[processErrorSymbol] = true;
                        producedError = e;
                    }
                }

                if (producedError) {
                    return {
                        fieldKey,
                        error: producedError
                    };
                } else {
                    return true;
                }
            }

            function getFailures(): types.Failure[] {
                const failures: types.Failure[] = [];

                for (const fieldKey of Object.keys(validatorKeyMap)) {
                    let fieldErrors = 0;
                    const checkInput = getCheckInput({ action, state, fieldKey });
                    for (const validatorKey of validatorKeyMap[fieldKey]) {
                        if (fieldErrors < mode) {
                            const validator = getValidator(validatorMap, validatorKey, false);
                            const result = getResult(validator, fieldKey, checkInput);
                            if (result !== true) {
                                fieldErrors += 1;
                                failures.push(result);
                            }
                        } else {
                            break;
                        }
                    }
                }

            return failures;
        }

        return ((failures) => failures.length ? buildErrorMaps(failures) : true)(getFailures());
    }

    return (mode === 0) ? binaryProcess() : normalProcess();
}
