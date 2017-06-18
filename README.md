# Redux TSA 

[![Build](https://travis-ci.org/contrarian/redux-tsa.svg?branch=master)](https://travis-ci.org/contrarian/redux-tsa.svg?branch=master) [![codecov](https://codecov.io/gh/contrarian/redux-tsa/branch/master/graph/badge.svg)](https://codecov.io/gh/contrarian/redux-tsa)

Async friendly validation middleware for Redux

```Note: Not ready for use!```

# Gist

### You define validators for your actions

```typescript
const even: SyncValidator<State, Transaction, "amount"> = {
    check({ field }) {
        return Number.isInteger(field / 2)
    },
    error({ fieldKey }) {
        return `${fieldKey} must be even`;
    },
};

const goodPerson: AsyncValidator<State, Transaction, 'target'> = {
    check({ field }) {
        // backgroundCheck calls an API that performs a background check
        return backgroundCheck(field);
    },
    error({ field }) {
        return `${field} is a criminal`;
    },
};
```
### You use ```validate``` and ```validateSync``` to  augments an action with valdiators
```typescript
interface Transaction extends Redux.Action {
    target: string;
    amount: number;
}

function withdrawal(target: string, amount: number): Transaction {
    const action = {
        target,
        amount,
        type: types.WITHDRAWAL,
    };
 
    // you can really mix sync and validators, they will be normalized internally
    const validatorMap: ValidatorMap<State, Transaction> = {
        target: [goodPerson],
        amount: [even]
    };

    return validate({ action, validatorMap });
}
```
### Redux TSA will perform the specifed validation:
  - If there are no errors, the action is passed to the next middleware in the chain 
  - If an error occurs:
    - the original action is halted
    - an error action is created (using the specified error action creator) and dispatched

### You listen for failures in your reducers using ```generateErrorType```

```typescript
// inside a reducer
case generateErrorType(types.WITHDRAWAL):
  return { ...state, transactionErrors: action.fieldErrors };
```

# API 

## Functions

* configureReduxTSA
* generateErrorType
* validate
* validateSync

## Types/Interface 

* SyncValidator
* AsyncValidator 
* ValidatorMap
* SyncValidatorMap
* ErrorMap
* ErrorAction
