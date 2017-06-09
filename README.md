# Redux TSA 

Async friendly validation middleware for Redux

```Note: Not ready for use!```

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






