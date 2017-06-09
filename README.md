# Redux TSA 

Async friendly validation middleware for Redux

```Note: Not ready for use!```

# Gist

### You configure Redux TSA with a ```ValidatorMap``` and an action creator. 

```typescript
const syncValidators = {
  isReasonable: {
    check({ field }) {
      return field < 1000;
    }
    error({ fieldKey, field }) {
      return `${field} is not a reasonable for ${field}`;
    },
  },
} 

const asyncValidators = {
  isPoetic: {
    async check({ field }) {
      // isPoetic calls an API that determines if something is poetic
      return await isPoetic(field)
    }
    error({ fieldKey }) {
      return `${fieldKey} must be poetic, c'mon ${field} is not poetic`;
    },
  },
} 

const validatorMap = {
  sync: syncValidators,
  async: asyncValidators
} 

// this is the default, explicitly defined for illustration
function onError(type, fieldErrors, processErrors) {
 return {
   type,
   fieldErrors,
   processErrors
 }
}

// make sure to applyMiddleware
const reduxTSA = configReduxTSA(validatorMap, onError);
```
### You use ```validate``` to specify validation for any action
```typescript
export addNote(note: string, amount: number): Redux.Action {
  const action = {    
    type: "ADD_NOTE"
    note,
    amount
  };
  
  const validatorKeyMap = {
   note: ["isPoetic"],
   amount: ["isReasonable", "isPoetic"]
  }
  
  // you can freely mix your sync/async validators, they will be normalized internally
  return validate({ action, validatorKeyMap, mode: 1, async: true });
}
```
### Redux TSA will perform the specifed validation:
  - If there are no errors, the action is passed to the next middleware in the chain 
  - If an error occurs:
    - the original action is halted
    - an error action is created (using the specified action creator) and dispatched

```typescript
// if this action is dispatched, and "less is more only when more is too much" and 123
// are deemed poetic, then the action will be passed to the next middleware
addNote("less is more only when more is too much", 123)

// if this action is dispatched, it will be halted, and an error action will be created and dispatched
addNote("this is not poetic", 5500)
```

### You listen for failures in your reducers using ```generateErrorType```

```typescript
// inside a reducer
case generateErrorType("ADD_NOTE"):
  return { ...state, noteErrors: action.fieldErrors };
```

# API 

* configureReduxTSA
* generateErrorType
* validate

## configureReduxTSA

 ```typescript
type configureReduxTSA<S> = (config: MiddlewareConfig<S>) => Redux.Middleware
```

### MiddlewareConfig
```typescript
interface MiddlewareConfig<S> {
    validatorMap: ValidatorMap<S>;
    onError: OnError;
}
```
#### ValidatorMap

```typescript

interface ValidatorMap<S> {
  sync: SyncValidatorMap<S>;
  async: AsyncValidatorMap<S>;
}

interface SyncValidatorMap<S> {
    [key: string]: SyncValidator<S>;
}

interface AsyncValidatorMap<S> {
    [key: string]: AsyncValidator<S>;
}
```
##### Validator

 ```typescript
interface SyncValidator<S> {
    check: SyncCheck<S>;
    error: ProduceError<S>;
}

interface AsyncValidator<S> {
    check: AsyncCheck<S>;
    error: ProduceError<S>;
}
```

###### Check

```typescript
type SyncCheck<S> = (input: CheckInput<S>) => CheckOutput;

type AsyncCheck<S> = (input: CheckInput<S>) => Promise<CheckOutput>;

interface CheckInput<S> {
    fieldKey: string;
    field: any;
    action: Redux.Action;
    state: S;
}

export type CheckOutput = boolean | object;
```
###### ProduceError

```typescript
type ProduceError<S> = (input: ProduceErrorInput<S>) => TSAError;

export interface Context {
    [key: string]: any;
}

export interface ProduceErrorInput<S> extends CheckInput<S> {
    context: Context;
}

TSAError = Error | string;
```

## OnError

```typescript
export type OnError = (type: string, fieldErrors: ErrorMap, processErrors: ErrorMap) => Redux.Action;
```

### ErrorMap
```typescript
interface ErrorMap {
    [fieldKey: string]: TSAError[];
}
```
# generateErrorType

```typescript
 type generateErrorType = (type: any) => ActionType;
```

# validate
```typescript
type Validate = (config: ValidateInput) => Redux.Action
```

## ValidateInput

```typescript
interface ValidateInput {
    action: types.Action;
    validatorKeyMap: types.ValidatorKeyMap;
    mode: number;
    async: boolean;
}
```

### ValidatorKeyMap

```typescript
export interface ValidatorKeyMap {
    [fieldKey: string]: string[];
}
```






