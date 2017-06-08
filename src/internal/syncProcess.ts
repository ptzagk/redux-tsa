import { processErrorSymbol } from "./symbols";
import { errorCount, getCheckInput, isEmpty, updateErrorMaps} from "./utils/process";

import * as types from "types";


export default function process({
    state,
    action,
    validatorMap,
    validatorKeyMap,
    mode,
}: types.ProcessInput): types.ProcessOutput {

    function binaryProcess(): types.ProcessOutput {
        for (const fieldKey of Object.keys(validatorKeyMap)) {
            const checkInput = getCheckInput(fieldKey);
            for (const validatorKey of validatorKeyMap[fieldKey]) {
                const { check } = validatorMap.sync[validatorKey];
                if (!check(checkInput)) {
                    return false;
                }
            }
        }
        return true;
    }

    function normalProcess(): types.ProcessOutput {
        let fieldErrors: types.ErrorMap = {};
        let processErrors: types.ErrorMap = {};

        for (const fieldKey of Object.keys(validatorKeyMap)) {
            const checkInput = getCheckInput({ action, state, fieldKey });
            for (const validatorKey of validatorKeyMap[fieldKey]) {
                if (errorCount({ fieldKey, fieldErrors, processErrors }) === mode) {
                    break;
                }
                const { check, error: getError } = validatorMap.sync[validatorKey];
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
                    producedError = getError({ ...checkInput, context });
                }

                if (producedError) {
                    ({ fieldErrors, processErrors } = updateErrorMaps({
                        fieldKey,
                        fieldErrors,
                        processErrors,
                        error: producedError,
                    }));
                }
            }
        }

        const success = isEmpty(fieldErrors) && isEmpty(processErrors)

        return success ? true : { fieldErrors, processErrors };
    }

    if (mode === 0) {
        return binaryProcess();
    } else {
        return normalProcess();
    }
}
