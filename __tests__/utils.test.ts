import 'jest';
import { validate } from "../src/internal/utils";
import { modeSymbol, validatorKeyMapSymbol} from '../src/internal/symbols';

describe('utils', () => {
    describe('validate', () => {
        const action = {
            type: 'LOVE_IS_IMPORTANT',
            amount: 2000,
            purpose: 'agua'
        };

        const validatorKeyMap = {
            amount: ['isReasonable', 'isAvailable'],
            purpose: ['isReasonable']
        };

        test('augments action with given validatorKeyMap, and mode defaults to Infinity', () => {
            const augmentedAction = validate(action, validatorKeyMap);

            expect(augmentedAction[validatorKeyMapSymbol]).toEqual(validatorKeyMap);
            expect(augmentedAction[modeSymbol]).toEqual(Infinity);
        });

        test('augments action with given validatorKeyMap and mode', () => {
            const augmentedAction = validate(action, validatorKeyMap, 5);

            expect(augmentedAction[validatorKeyMapSymbol]).toEqual(validatorKeyMap);
            expect(augmentedAction[modeSymbol]).toEqual(5);
        });
    });
})
