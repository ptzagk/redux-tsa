import { processErrorSymbol } from "./symbols";
import { flatten } from "./utils/general";
import { getCheckInput, getValidator, updateErrorMaps} from "./utils/process";
import skurt from "./utils/skurt";

import * as types from "types";

export default function asyncProcess<S>({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput<S>): Promise<types.ProcessOutput> {

    function failure(result: types.ValidationResult): types.Failure | false{
        return (result !== true) ? result : false;
    }

    function binaryProcess(): Promise<types.ProcessOutput> {
        const results = [];
        for (const fieldKey of Object.keys(validatorKeyMap)) {
            const checkInput = getCheckInput({ action, state, fieldKey});
            for (const validatorKey of validatorKeyMap[fieldKey]) {
                const { check } = getValidator(validatorMap, validatorKey);
                results.push(Promise.resolve(check(checkInput)));
            }
        }

        return skurt(failure)(1)(results).then((failures => !failures.length));
    }

    function normalProcess(): Promise<types.ProcessOutput> {

        function getResult(
            { check, error }: types.Validator<S>,
            fieldKey: string,
            checkInput: types.CheckInput<S>,
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
            })
            .then((error) => {
                return {
                    fieldKey,
                    error
                };
            });
        }

        function getFieldFailures(): Promise<types.Failure[]>[] {
            const findFailures = skurt(failure)(mode);
            const fieldResults: Promise<types.Failure[]>[] = [];

            for (const fieldKey of Object.keys(validatorKeyMap)) {
                const fieldResult: Promise<types.ValidationResult>[] = [];
                const checkInput = getCheckInput({ action, state, fieldKey});
                for (const validatorKey of validatorKeyMap[fieldKey]) {
                    const validator = getValidator(validatorMap, validatorKey);
                    const result = getResult(validator, fieldKey, checkInput);
                    fieldResult.push(result);
                }
                fieldResults.push(findFailures(fieldResult))
            }

            return fieldResults;
        }
        function buildErrorMaps(failures: types.Failure[]): types.ErrorMaps {
            const fieldErrors: types.ErrorMap = {};
            const processErrors: types.ErrorMap = {};

            for (const { fieldKey, error } of failures) {
                updateErrorMaps({
                    fieldKey,
                    error,
                    fieldErrors,
                    processErrors,
                });
            }

            return { fieldErrors, processErrors };
        }

        return Promise.all(getFieldFailures())
            .then(flatten)
            .then(failures => {
                if (failures.length) {
                    return buildErrorMaps(failures);
                } else {
                    return true;
                }
            });
    }

    return mode === 0 ? binaryProcess() : normalProcess();
}
