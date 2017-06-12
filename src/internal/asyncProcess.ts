import { processErrorSymbol } from "./symbols";
import { flatten } from "./utils/general";
import { buildErrorMaps, getCheckInput, getValidator } from "./utils/process";
import skurt from "./utils/skurt";

import * as types from "types";

export default function asyncProcess<S>({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput<S>): Promise<types.ProcessOutput> {

    function failure(result: types.ValidationResult): boolean {
        return result !== true;
    }

    function binaryProcess(): Promise<types.ProcessOutput> {
        const results = [];
        for (const fieldKey of Object.keys(validatorKeyMap)) {
            const checkInput = getCheckInput({ action, state, fieldKey});
            for (const validatorKey of validatorKeyMap[fieldKey]) {
                const { check } = getValidator(validatorMap, validatorKey, true);
                results.push(Promise.resolve(check(checkInput)));
            }
        }

        return skurt(failure)(1)(results).then((failures) => !failures.length);
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
                    return {
                        fieldKey,
                        error: error({ ...checkInput, context }),
                    }
                }
            })
            .catch((externalError) => {
                externalError[processErrorSymbol] = true;
                return {
                    fieldKey,
                    error: externalError,
                };
            });
        }

        function getFieldFailures(): Array<Promise<types.Failure[]>> {
            const findFailures = skurt(failure)(mode);
            const fieldResults: Array<Promise<types.Failure[]>> = [];

            for (const fieldKey of Object.keys(validatorKeyMap)) {
                const fieldResult: Array<Promise<types.ValidationResult>> = [];
                const checkInput = getCheckInput({ action, state, fieldKey});
                for (const validatorKey of validatorKeyMap[fieldKey]) {
                    const validator = getValidator(validatorMap, validatorKey, true);
                    const result = getResult(validator, fieldKey, checkInput);
                    fieldResult.push(result);
                }
                fieldResults.push(findFailures(fieldResult));
            }

            return fieldResults;
        }

        return Promise.all(getFieldFailures())
            .then(flatten)
            .then((failures) => {
                if (failures.length) {
                    return buildErrorMaps(failures);
                } else {
                    return true;
                }
            });
    }

    return mode === 0 ? binaryProcess() : normalProcess();
}
