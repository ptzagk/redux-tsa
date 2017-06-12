export interface Action {
    type: any;
    [fieldKey: string]: any;
}

export interface ValidatorKeyMap {
    [fieldKey: string]: string[];
}

export interface Context {
    [key: string]: any;
}

export type CheckOutput = boolean | object;

export interface CheckInput<S> {
    fieldKey: string;
    field: any;
    action: Action;
    state: S;
}

type SyncCheck<S> = (input: CheckInput<S>) => CheckOutput;

type AsyncCheck<S> = (input: CheckInput<S>) => Promise<CheckOutput>;

type Check<S> = SyncCheck<S> | AsyncCheck<S>;

export interface ProduceErrorInput<S> extends CheckInput<S> {
    context: Context;
}

type ProduceError<S> = (input: ProduceErrorInput<S>) => TSAError;

export interface SyncValidator<S> {
    check: SyncCheck<S>;
    error: ProduceError<S>;
}

export interface AsyncValidator<S> {
    check: AsyncCheck<S>;
    error: ProduceError<S>;
}

export interface SyncValidatorMap<S> {
    [key: string]: SyncValidator<S>;
}

export interface AsyncValidatorMap<S> {
    [key: string]: AsyncValidator<S>;
}

export type Validator<S> = SyncValidator<S> | AsyncValidator<S>;

export interface ValidatorMap<S> {
    sync: SyncValidatorMap<S>;
    async: AsyncValidatorMap<S>;
}

type LoadedSyncCheck = () => CheckOutput;

type LoadedAsyncCheck = () => Promise<CheckOutput>;

type LoadedProduceError = (context: Context) => TSAError;

export interface LoadedSyncValidator {
    check: LoadedSyncCheck;
    error: LoadedProduceError;
}

export interface LoadedAsyncValidator {
    check: LoadedAsyncCheck;
    error: LoadedProduceError;
}

interface ErrorLike {
    message: string;
    [sym: string]: any;
}

interface ErrorWithExternalLabel extends Error {
    [sym: string]: any;
}

export type TSAError = ErrorWithExternalLabel | ErrorLike | string;

export interface ErrorMap {
    [fieldKey: string]: TSAError[];
}

export interface Failure {
    fieldKey: string;
    error: TSAError;
}

export type OnError = (type: string, fieldErrors: ErrorMap, processErrors: ErrorMap) => Action;

export interface MiddlewareConfig<S> {
    validatorMap: ValidatorMap<S>;
    onError?: OnError;
}

export interface ProcessInput<S> {
    action: Action;
    state: S;
    mode: number;
    validatorMap: ValidatorMap<S>;
    validatorKeyMap: ValidatorKeyMap;
}

export interface ErrorMaps {
    fieldErrors: ErrorMap;
    processErrors: ErrorMap;
}

export type ProcessOutput = ErrorMaps | boolean;

export type ValidationResult = Failure | true;

export type FieldValidationResult = ValidationResult[];

// configureReduxTSA is a higer-order function that produces a configured Redux TSA middleware.
