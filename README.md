# Redux TSA

[![Build Status](https://travis-ci.org/contrarian/redux-tsa.svg?branch=master)](https://travis-ci.org/contrarian/redux-tsa) [![codecov](https://codecov.io/gh/contrarian/redux-tsa/branch/master/graph/badge.svg)](https://codecov.io/gh/contrarian/redux-tsa) [![codebeat badge](https://codebeat.co/badges/eb7c0635-61cb-4f68-a744-6fe62c54380e)](https://codebeat.co/projects/github-com-contrarian-redux-tsa-master) [![npm version](https://badge.fury.io/js/redux-tsa.svg)](https://badge.fury.io/js/redux-tsa)

Async friendly validation middleware for Redux

# Overview

1. Gist
2. API
3. Performance
4. Complementary Libraries
5. Examples

# Gist

### You define validators

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
### You use ```validate``` or ```validateSync``` to specify validation
```typescript
type TransactionType = "DEPOSIT" | "WITHDRAWAL";

interface Transaction extends Redux.Action {
    type: TransactionType;
    target: string;
    amount: number;
}

function withdrawal(target: string, amount: number): Transaction {
    const action: Transaction = {
        amount,
        target,
        type: "WITHDRAWAL",
    };

    // you can mix sync and async validators, they will be normalized internally
    const validatorMap: ValidatorMap<State, Transaction> = {
        target: [goodPerson],
        amount: [fundsAvailable, even],
    };

    return validate({ action, validatorMap });
}
```

### Redux TSA will perform the specified validation:
  - If validation succeeds, the original action is passed to the next middleware
  - If validation fails, an error action is passed to the next middleware

### You use the ```isTSAErrorAction``` type guard to check for failure:

```typescript
// inside a reducer
case "WITHDRAWAL":
    if (isTSAErrorAction(action)) {
        return { ...state, errors: action.fieldErrors! };
    } else {                
        return initialState;
    }
```

# API

## Functions

* reduxTSA
* validate
* validateSync
* isTSAErrorAction

### reduxTSA

```reduxTSA``` is the middleware:

```typescript

import reduxTSA from "redux-tsa";

applyMiddleware(reduxTSA)

```

### validate

```validate``` specifies async validation for an action:

```typescript

/**
 * mode specifies the max number of errors that should be captured per field
 * fieldErrors and processErrors both affect the error count
 * mode defaults to Infinity, which captures as many errors as possible
 * mode=0 specifies binary validation
 * a lower mode means faster validation because the validators for a given field are raced
 */
interface ValidateInput<S, A extends Redux.Action> {
    action: A;
    validatorMap: ValidatorMap<S, A>;
    mode?: number;
}

validate<A extends Redux.Action>(input: ValidateInput) => A;
```

### validateSync

```validateSync``` specifies sync validation for an action:

```typescript

/**
 * mode specifies the max number of errors that should be populated per field
 * fieldErrors and processErrors both affect the error count
 * mode defaults to Infinity, which captures as many errors as possible
 * mode=0 specifies binary validation
 * a lower mode means faster validation becuase sync validation is performed lazily
 */
interface ValidateSyncInput<S, A extends types.Action> {
    action: A;
    validatorMap: types.SyncValidatorMap<S, A>;
    mode?: number;
}

validateSync<A extends Redux.Action>(input: ValidateSyncInput) => A;
```

### isTSAErrorAction

```isTSAErrorAction``` is a type guard that is used to determine whether an action passed validation:

```typescript
isError<A extends Redux.Action>(action: TSAAction<A>): action is TSAErrorAction<A>
```

## Types/Interfaces

* AsyncValidator
* SyncValidator
* SyncValidatorMap
* Validator
* ValidatorMap
* TSAAction
* TSAError
* ErrorMap

```Only the above types/interfaces are exported. Other types/interfaces are also listed below for clarity.```

### AsyncValidator

```typescript

// ValidatorInput is used for both AsyncValidators and SyncValidators
interface ValidatorInput<S, A extends Redux.Action, K extends keyof A> {
    fieldKey: K;
    field: A[K];
    action: A;
    state: S;
}

// ProduceError is used for both AsyncValidators and SyncValidators
type ProduceError<S, A extends Redux.Action, K extends keyof A> = (
    input: ValidatorInput<S, A, K>
) => TSAError;

type AsyncCheck<S, A extends Redux.Action, K extends keyof A> = (
    input: ValidatorInput<S, A, K>
) => Promise<boolean>;

interface AsyncValidator<S, A extends Redux.Action, K extends keyof A> {
    check: AsyncCheck<S, A, K>;
    error: ProduceError<S, A, K>;
}
```

### SyncValidator

```typescript
type SyncCheck<S, A extends Redux.Action, K extends keyof A> = (
    input: ValidatorInput<S, A, K>
) => boolean;

interface SyncValidator<S, A extends Redux.Action, K extends keyof A> {
    check: SyncCheck<S, A, K>;
    error: ProduceError<S, A, K>;
}
```

### SyncValidatorMap

```typescript
type SyncValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<SyncValidator<S, A, K>>;
};
```

### Validator

```typescript

type Validator<S, A extends Redux.Action, K extends keyof A> = 
    SyncValidator<S, A, K> | AsyncValidator<S, A, K>;
```

### ValidatorMap

```typescript

type Validator<S, A extends Redux.Action, K extends keyof A> = SyncValidator<S, A, K> | AsyncValidator<S, A, K>;

type ValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<Validator<S, A, K>>;
};
```

### TSAAction

```typescript

/**
 * fieldErrors are the errors produced by your validators
 * processErrors are the errors that occur when trying to run your validators (e.g. failed network request)
 * fieldErrors and processErrors will be null only if mode=0
 */
interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    type: A[T];
    error: boolean;
    fieldErrors: types.ErrorMap<A> | null;
    processErrors: types.ErrorMap<A> | null;
}

type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

type TSAAction<A extends Redux.Action> = A | ErrorAction<A>;
```

### TSAError

```typescript
type TSAError = Error | string;
```

### ErrorMap

```typescript
type ErrorMap<A extends Redux.Action> = { [K in keyof A]?: TSAError[] };
```
# Performance

Redux TSA makes validation fast using the concept of a ```mode```. ```mode``` is specified when calling either ```validate``` or ```validateSync```, and specifies how many errors to capture per field. The lower the ```mode```, the faster validation will be.

## Async Performance

When performing async validation:
* Redux TSA *races* the validators for each field. Redux TSA is done validating a field as soon as ```mode``` number of errors are found.
* Redux TSA runs the validators for each field *concurrently*.

## Sync Performance

When performing sync validation:
* Redux TSA runs the validators *lazily*. If  ```mode``` number of errors were already found for a field, then Redux TSA will not run any more validators for that field.

# Complementary Libraries

1. [Redux Transform](https://github.com/contrarian/redux-transform): lets you transform the properties of an action in much the same way that Redux TSA lets validate the properties of an action. 

# Examples

An example application using Redux TSA:
- [TypeScript](https://github.com/contrarian/redux-tsa/tree/master/examples/ts)
- [JavaScript](https://github.com/contrarian/redux-tsa/tree/master/examples/js)
