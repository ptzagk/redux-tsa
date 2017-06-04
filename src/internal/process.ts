import { processErrorSymbol } from "./symbols";

import * as types from "types";

export default async function process({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput): Promise<types.ProcessOutput> {

    function isEmpty(errorMap: types.ErrorMap): boolean {
        return Boolean(Object.keys(errorMap).length);
    }

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

    function getLoadedFieldValidators(fieldKey: string): types.LoadedNormalizedValidator[] {
        const fieldValidators = getFieldValidators(fieldKey);
        const checkInput = getCheckInput(fieldKey);
        return fieldValidators.reduce((loadedFieldValidators, fieldValidator) => {
            return [
                ...loadedFieldValidators,
                loadValidator(fieldValidator, checkInput),
            ];
        }, []);
    }

    function validateField(fieldKey: string): types.ValidationResult[] {
        const loadedFieldValidators = getLoadedFieldValidators(fieldKey);
        return loadedFieldValidators.map((validator) => {
            return {
                checkOutput: validator.check(),
                error: validator.error,
            };
        });
    }

    function runValidators(): types.ValidationResultMap {
        const fieldsToValidate = Object.keys(validatorKeyMap);
        return fieldsToValidate.reduce((validationResults, fieldKey) => {
            return {
                ...validationResults,
                [fieldKey]: validateField(fieldKey),
            };
        }, {});
    }

    async function binaryProcess(results: types.ValidationResultMap): Promise<types.ProcessOutput> {
        const fieldsToValidate = Object.keys(validatorKeyMap);
        for (const fieldKey of fieldsToValidate) {
            for (const { checkOutput } of results[fieldKey]) {
                if ((await checkOutput) !== true) {
                    return false;
                }
            }
        }
        return true;
    }

    function processResult( result: types.ValidationResult): Promise<types.TSAError | true> {
        return result.checkOutput
            .then((checkOutput) => {
                if (checkOutput === true) {
                    return true;
                } else {
                    const context = (checkOutput === false) ? {} : checkOutput;
                    return result.error(context);
                }
            })
            .catch((externalError) => {
                externalError[processErrorSymbol] = true;
                return externalError;
            });
    }

    async function normalProcess(results: types.ValidationResultMap): Promise<types.ProcessOutput> {
        const fieldErrors: types.ErrorMap = {};
        const processErrors: types.ErrorMap = {};
        const fieldsToValidate = Object.keys(validatorKeyMap);

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

        for (const fieldKey of fieldsToValidate) {
            for (const result of results[fieldKey]) {
                if (mode === Infinity || mode < errorCount(fieldKey)) {
                    const processedResult = await processResult(result);
                    if (processedResult !== true) {
                        updateErrorMaps(fieldKey, processedResult);
                    }
                } else {
                    break;
                }
            }
        }

        const success = isEmpty(fieldErrors) && isEmpty(processErrors);

        return success ? success : { fieldErrors, processErrors };
    }

    const validationResults = runValidators();

    if (mode === 0) {
        return binaryProcess(validationResults);
    } else {
        return normalProcess(validationResults);
    }
}
