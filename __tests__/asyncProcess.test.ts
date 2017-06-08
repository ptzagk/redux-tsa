import 'jest';

import asyncProcess from '../src/internal/asyncProcess';
import { getCheckInput } from "../src/internal/utils";

import validatorMap from './example/validationMap';

// import state from './example/state';

import * as types from "../src/types";

describe('process', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // 10 second timeout

    const state: types.State = {
        names: ['orange', 'grapefruit', 'steel', 'copper'],
    };

    const action: types.Action = {
        type: "MAGIC_IS_IMPORTANT",
        amount: 125,
        name: 'purple'
    };

    test('watch it go', () => {
        // const validatorKeyMap = {
        //     amount: ['isReasonable'],
        //     name: ['isPoetic', 'isAvailable']
        // }

        const validatorKeyMap = {
            amount: ['isReasonable', 'isPoetic'],
        }

        const isReasonable = validatorMap.async.isReasonable;

        const checkInput = getCheckInput({
            fieldKey: 'amount',
            action,
            state
        });

        const processInput: types.ProcessInput = {
            action,
            state,
            validatorMap,
            validatorKeyMap,
            mode: 0
        };


        asyncProcess(isReasonable, checkInput)
        .then((result: any) => expect(result).toEqual(50));
        // expect.assertions(1);
        // return asyncProcess(processInput).then(result => expect(result).toEqual(true));
        // return user.getUserName(4).then(data => expect(data).toEqual('Mark'));
        // return expect(asyncProcess(processInput)).resolves.toEqual('Paul')

    });

    // test('async they think', () => {
    //     const still = new Promise((resolve, reject) => {
    //         setTimeout(resolve, 1000);
    //     }).then(() => {
    //         setTimeout(() => 'freaky deaky', 2000);
    //     })
    //     .then(() => {
    //         return 'waste';
    //     });
    //
    //
    //     return still;
    // })
})

export default function getResult(
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

// export default function printResult(
//     validator: types.Validator,
//     checkInput: types.CheckInput,
// ): any {
//     return getResult(validator, checkInput).then(result => 50);
// }
// function take5 () {
//     return setTimeout(() => {}, 5000);
// }
// export default function getResult(
//     { check, error }: types.Validator,
//     checkInput: types.CheckInput,
// ): Promise<types.ValidationResult> | any {
//     return new Promise((resolve) => {
//         setTimeout(resolve(take5()), 5000);
//     }).then(() => 'huh');
//     // return new Promise((resolve) => {
//     //     resolve(check(checkInput));
//     // })
// }
