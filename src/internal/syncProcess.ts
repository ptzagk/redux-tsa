import { processErrorSymbol } from "./symbols";
import { buildErrorMaps, getValidatorInput } from "./utils/process";

import * as types from "../types";

export default function syncProcess<S, A extends types.Action>({
    state,
    action,
    validatorMap,
    mode,
}: types.ProcessInput<S, A>): types.ProcessOutput {

    function binaryProcess(): types.ProcessOutput {
        for (const fieldKey of Object.keys(validatorMap)) {
            const validatorInput = getValidatorInput({ action, state, fieldKey });
            for (const validator of validatorMap[fieldKey]) {
                try {
                    if (!validator.check(validatorInput)) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
            }
        }
        return true;
    }

    function normalProcess(): types.ProcessOutput {
            function getResult<S, A extends types.Action, K extends keyof A>(
                { check, error }: types.Validator<S, A, K>,
                fieldKey: K,
                validatorInput: types.ValidatorInput<S, A, K>,
            ): types.ValidationResult {
                let checkOutput, producedError;
                try {
                    checkOutput = check(validatorInput);
                } catch (e) {
                    e[processErrorSymbol] = true;
                    producedError = e;
                }
                if (!producedError && !checkOutput) {
                    try {
                        producedError = error(validatorInput);
                    } catch (e) {
                        e[processErrorSymbol] = true;
                        producedError = e;
                    }
                }

                if (producedError) {
                    return {
                        fieldKey,
                        error: producedError,
                    };
                } else {
                    return true;
                }
            }

            function getFailures(): types.Failure[] {
                const failures: types.Failure[] = [];

                for (const fieldKey of Object.keys(validatorMap)) {
                    let fieldErrors = 0;
                    const validatorInput = getValidatorInput({ action, state, fieldKey });
                    for (const validator of validatorMap[fieldKey]) {
                        if (fieldErrors < mode) {
                            const result = getResult(validator, fieldKey, validatorInput);
                            if (result !== true) {
                                fieldErrors += 1;
                                failures.push(result as types.Failure);
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
