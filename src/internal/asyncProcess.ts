import { processErrorSymbol } from "./symbols";
import { flatten } from "./utils/general";
import { buildErrorMaps, getValidatorInput } from "./utils/process";
import skurt from "./utils/skurt";

import * as types from "../types";

export default function asyncProcess<S, A extends types.Action>({
    state,
    action,
    validatorMap,
    mode,
}: types.ProcessInput<S, A>): Promise<types.ProcessOutput> {

    function failure(result: types.ValidationResult): boolean {
        return result !== true;
    }

    function binaryProcess(): Promise<types.ProcessOutput> {
        const results = [];
        for (const fieldKey of Object.keys(validatorMap)) {
            const validatorInput = getValidatorInput({ action, state, fieldKey});
            for (const validator of validatorMap[fieldKey]) {
                results.push(Promise.resolve(validator.check(validatorInput)));
            }
        }

        return skurt(failure)(1)(results).then((failures) => !failures.length);
    }

    function normalProcess(): Promise<types.ProcessOutput> {

        function getResult<S, A extends types.Action, K extends keyof A>(
            { check, error }: types.Validator<S, A, K>,
            fieldKey: string,
            validatorInput: types.ValidatorInput<S, A, K>,
        ): Promise<types.ValidationResult> {
            return new Promise((resolve) => {
                resolve(check(validatorInput));
            })
            .then((result) => {
                if (result === true) {
                    return true;
                } else {
                    return {
                        fieldKey,
                        error: error(validatorInput),
                    };
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

            for (const fieldKey of Object.keys(validatorMap)) {
                const fieldResult: Array<Promise<types.ValidationResult>> = [];
                const validatorInput = getValidatorInput({ action, state, fieldKey});
                for (const validator of validatorMap[fieldKey]) {
                    const result = getResult(validator, fieldKey, validatorInput);
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
