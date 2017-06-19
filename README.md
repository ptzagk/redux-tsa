# Redux TSA 

[![Build](https://travis-ci.org/contrarian/redux-tsa.svg?branch=master)](https://travis-ci.org/contrarian/redux-tsa.svg?branch=master) [![codecov](https://codecov.io/gh/contrarian/redux-tsa/branch/master/graph/badge.svg)](https://codecov.io/gh/contrarian/redux-tsa)

Async friendly validation middleware for Redux

```Note: Not ready for use!```

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

    // you can mix sync and validators, they will be normalized internally
    const validatorMap: ValidatorMap<State, Transaction> = {
        target: [goodPerson],
        amount: [fundsAvailable, even],
    };

    return validate({ action, validatorMap });
}
```

### Redux TSA will perform the specifed validation:
  - If validation succeeds, the original action is passed to the next middleware
  - If validation fails, an error action is passed to the next middleware

### You use the ```isError``` type guard to check for failure:

```typescript
// inside a reducer
case "WITHDRAWAL":
    if (isError(action)) {
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
* isError

### reduxTSA

```reduxTSA``` is the middleware:

```typescript

import reduxTSA from "redux-tsa";

applyMiddleware(reduxTSA)

```

### validate

```validate``` specifies async validation for an action:

```typescript

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

interface ValidateSyncInput<S, A extends types.Action> {
    action: A;
    validatorMap: types.SyncValidatorMap<S, A>;
    mode?: number;
}

validateSync<A extends Redux.Action>(input: ValidateSyncInput) => A; 
```

### isError

```isError``` is a type guard that is used to determine whether an action passed validation:

```typescript
isError<A extends Redux.Action>(action: TSAAction<A>): action is ErrorAction<A>
```

## Types/Interfaces 

* AsyncValidator 
* SyncValidator
* SyncValidatorMap
* ValidatorMap
* TSAAction
* ErrorMap

### AsyncValidator

```typescript

// ValidatorInput is used for both AsyncValidators and SyncValidators
interface ValidatorInput<S, A extends Redux.Action, K extends keyof A> {
    fieldKey: K;
    field: A[K];
    action: A;
    state: S;
}

type TSAError = Error | string;

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

### ValidatorMap

```typescript

type Validator<S, A extends Redux.Action, K extends keyof A> = SyncValidator<S, A, K> | AsyncValidator<S, A, K>;

type ValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<Validator<S, A, K>>;
};
```

### TSAAction

```typescript
interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    type: A[T];
    error: boolean;
    fieldErrors: types.ErrorMap<A> | null;
    processErrors: types.ErrorMap<A> | null;
}

type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

type TSAAction<A extends Redux.Action> = A | ErrorAction<A>;
```

### ErrorMap

```typescript
type ErrorMap<A extends Redux.Action> = { [K in keyof A]?: TSAError[] };
```
