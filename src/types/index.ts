import * as Redux from "redux";

export interface Action {
    type: any;
    [fieldKey: string]: any;
}

export interface ValidatorInput<S, A extends Redux.Action, K extends keyof A> {
    fieldKey: K;
    field: A[K];
    action: A;
    state: S;
}

export type SyncCheck<
    S,
    A extends Redux.Action,
    K extends keyof A
> = (input: ValidatorInput<S,A,K>) => boolean;

export type AsyncCheck<
    S,
    A extends Redux.Action,
    K extends keyof A
> = (input: ValidatorInput<S,A,K>) => Promise<boolean>;

export type ProduceError<
    S,
    A extends Redux.Action,
    K extends keyof A
> = (input: ValidatorInput<S,A,K>) => TSAError;

export interface SyncValidator<
    S,
    A extends Redux.Action,
    K extends keyof A
> {
    check: SyncCheck<S,A,K>;
    error: ProduceError<S,A,K>;
}

export interface AsyncValidator<
    S,
    A extends Redux.Action,
    K extends keyof A
> {
    check: AsyncCheck<S,A,K>;
    error: ProduceError<S,A,K>;
}

export type Validator<S, A extends Redux.Action, K extends keyof A> = SyncValidator<S,A,K> | AsyncValidator<S,A,K>;

export type SyncValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: SyncValidator<S,A,K>[]
}

export type ValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Validator<S,A,K>[]
}

export interface ErrorLike {
    message: string;
    [sym: string]: any;
}

export interface ErrorWithExternalLabel extends Error {
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

export interface ProcessInput<S, A extends Redux.Action> {
    action: A;
    state: S;
    mode: number;
    validatorMap: ValidatorMap<S,A>;
}

export interface ErrorMaps {
    fieldErrors: ErrorMap;
    processErrors: ErrorMap;
}

export type ProcessOutput = ErrorMaps | boolean;

export type ValidationResult = Failure | boolean;

export type FieldValidationResult = ValidationResult[];
