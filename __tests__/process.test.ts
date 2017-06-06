import 'jest';

import { normalizeValidatorMap } from '../src/internal/utils';
import process from '../src/internal/process';

import mixedValidatorMap from './example/validationMap';
import state from './example/state';

describe('process', () => {
    const action = {
        type: "MAGIC_IS_IMPORTANT",
        amount: 125,
        name: 'purple'
    };

    const validatorMap = normalizeValidatorMap(mixedValidatorMap);

    test('watch it go', async () => {
        // const validatorKeyMap = {
        //     amount: ['isReasonable'],
        //     name: ['isPoetic', 'isAvailable']
        // }

        const validatorKeyMap = {
            name: ['isAvailable']
        }

        const processInput = {
            action,
            state,
            validatorMap,
            validatorKeyMap,
            mode: Infinity
        };

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        const result = await process(processInput);
        console.log(result);
    });
})
