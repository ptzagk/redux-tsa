import { processErrorSymbol } from "./symbols";

import * as types from "types";

export default async function process({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput): Promise<types.ProcessOutput> {

    function getLoadedFieldValidators(fieldKey: string): types.LoadedNormalizedValidator[] {

        function getFieldValidators(fieldKey: string): types.NormalizedValidator[] {
            const fieldValidatorKeys = validatorKeyMap[fieldKey];
            return fieldValidatorKeys.reduce((fieldValidators, validatorKey) => {
                return [
                    ...fieldValidators,
                    validatorMap[validatorKey],
                ];
            }, []);
        }

        function getCheckInput(fieldKey: string): types.CheckInput {
            return {
                action,
                state,
                fieldKey,
                field: action[fieldKey],
            };
        }

        function loadValidator(
            validator: types.NormalizedValidator,
            checkInput: types.CheckInput,
        ): types.LoadedNormalizedValidator {
            return {
                check() {
                    return validator.check(checkInput);
                },
                error(context: types.Context) {
                    return validator.error({ ...checkInput, context });
                },
            };
        }

        const fieldValidators = getFieldValidators(fieldKey);
        const checkInput = getCheckInput(fieldKey);
        return fieldValidators.reduce((loadedFieldValidators, fieldValidator) => {
            return [
                ...loadedFieldValidators,
                loadValidator(fieldValidator, checkInput),
            ];
        }, []);
    }

    function validate(): Promise<types.ActionValidationResult> {
        function runValidator(
            { check, error }: types.LoadedNormalizedValidator
        ): Promise<types.ValidationResult> {
            return new Promise((resolve) => {
                resolve(check());
            })
            .then((result) => {
                if (result === true) {
                    return true;
                } else {
                    const context = (result === false) ? {} : result;
                    return error(context);
                }
            })
            .catch((externalError) => {
                externalError[processErrorSymbol] = true;
                return externalError;
            });
        }

        function validateField(fieldKey: string): Promise<types.FieldValidationResult> {
            const loadedFieldValidators = getLoadedFieldValidators(fieldKey);
            return Promise.all(loadedFieldValidators.map(runValidator))
                .then((results) => {
                    return { fieldKey, results };
                });
        }

        const fieldsToValidate = Object.keys(validatorKeyMap);
        return Promise.all(fieldsToValidate.map(validateField));
    }

    function output(actionResult: Promise<types.ActionValidationResult>): Promise<types.ProcessOutput> {

        function fieldSuccess({ results }: types.FieldValidationResult): boolean {
            return results.every((result) => result === true);
        }

        function buildErrorMaps(failures: types.ActionValidationResult): types.ErrorMaps {
            const fieldErrors: types.ErrorMap = {};
            const processErrors: types.ErrorMap = {};

            function updateErrorMaps(fieldKey: string, error: types.TSAError): void {
                if (typeof error !== "string" && error[processErrorSymbol]) {
                    if (processErrors[fieldKey]) {
                        processErrors[fieldKey].push(error);
                    } else {
                        processErrors[fieldKey] = [ error ];
                    }
                } else {
                    if (fieldErrors[fieldKey]) {
                        fieldErrors[fieldKey].push(error);
                    } else {
                        fieldErrors[fieldKey] = [ error ];
                    }
                }
            }

            function errorCount(fieldKey: string): number {
                let fieldErrorCount, processErrorCount;

                if (fieldErrors[fieldKey]) {
                    fieldErrorCount = fieldErrors[fieldKey].length;
                } else {
                    fieldErrorCount = 0;
                }

                if (processErrors[fieldKey]) {
                    processErrorCount = processErrors[fieldKey].length;
                } else {
                    processErrorCount = 0;
                }

                return fieldErrorCount + processErrorCount;
            }

            for (const { results, fieldKey } of failures) {
                for (const error of results) {
                    if (errorCount(fieldKey) < mode) {
                        updateErrorMaps(fieldKey, error as types.TSAError);
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
