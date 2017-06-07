import { processErrorSymbol } from "./symbols";
import { errorCount, getCheckInput, getValidator, updateErrorMaps} from "./utils";

import * as types from "types";

export default function asyncProcess({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput): Promise<types.ProcessOutput> {

    function validate(): Promise<types.ActionValidationResult> {
        function getResult(
            { check, error }: types.Validator,
            checkInput: types.CheckInput,
        ): Promise<types.ValidationResult> {
            return new Promise((resolve) => {
                resolve(check(checkInput));
            })
            .then((result) => {
                if (result === true) {
                    return true;
                } else {
                    const context = (result === false) ? {} : result;
                    return error({ ...checkInput, context });
                }
            })
            .catch((externalError) => {
                externalError[processErrorSymbol] = true;
                return externalError;
            });
        }

        const actionResults: Promise<types.FieldValidationResult>[] = [];
        for (const fieldKey of Object.keys(validatorKeyMap)) {
            const checkInput = getCheckInput({ action, state, fieldKey});
            const fieldResults = [];
            for (const validatorKey of validatorKeyMap[fieldKey]) {
                const validator = getValidator(validatorMap, validatorKey);
                fieldResults.push(getResult(validator, checkInput));
            }
            actionResults.push(
                Promise.all(fieldResults)
                    .then((results) => {
                        return { fieldKey, results };
                    })
            );
        }
        return Promise.all(actionResults);
    }

    function output(actionResult: Promise<types.ActionValidationResult>): Promise<types.ProcessOutput> {

        function fieldSuccess({ results }: types.FieldValidationResult): boolean {
            return results.every((result) => result === true);
        }

        function buildErrorMaps(failures: types.ActionValidationResult): types.ErrorMaps {
            const fieldErrors: types.ErrorMap = {};
            const processErrors: types.ErrorMap = {};

            for (const { results, fieldKey } of failures) {
                for (const error of results) {
                    if (errorCount({ fieldKey, fieldErrors, processErrors }) < mode) {
                        updateErrorMaps({
                            fieldKey,
                            error: error as types.TSAError,
                            fieldErrors,
                            processErrors,
                        });;
                    } else {
                        break;
                    }
                }
            }

            return { fieldErrors, processErrors };
        }

        if (mode === 0) {
            return actionResult
                .then((fieldResults) => {
                    return fieldResults.every(fieldSuccess);
                });
        } else {
            return actionResult
                .then((fieldResults) => {
                    const failures = fieldResults.filter(fieldSuccess);
                    if (failures.length) {
                        return buildErrorMaps(failures)
                    } else {
                        return true;
                    }
                });
        }
    }

    return output(validate());
}
