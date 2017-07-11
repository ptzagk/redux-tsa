import * as Redux from "redux";

export interface AnyAction extends Redux.Action {
    [extraProps: string ]: any;
}

export interface ValidatorInput<S, A extends Redux.Action, K extends keyof A> {
    fieldKey: K;
    field: A[K];
    action: A;
    state: S;
}

export type SyncCheck<S, A extends Redux.Action, K extends keyof A> = (
    input: ValidatorInput<S, A, K>,
) => boolean;

export type AsyncCheck<S, A extends Redux.Action, K extends keyof A> = (
    input: ValidatorInput<S, A, K>,
) => Promise<boolean>;

export type ProduceError<S, A extends Redux.Action, K extends keyof A> = (
    input: ValidatorInput<S, A, K>,
) => TSAError;

export interface SyncValidator<S, A extends Redux.Action, K extends keyof A> {
    check: SyncCheck<S, A, K>;
    error: ProduceError<S, A, K>;
}

export interface AsyncValidator<S, A extends Redux.Action, K extends keyof A> {
    check: AsyncCheck<S, A, K>;
    error: ProduceError<S, A, K>;
}

export type Validator<S, A extends Redux.Action, K extends keyof A> = SyncValidator<S, A, K> | AsyncValidator<S, A, K>;

export type SyncValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<SyncValidator<S, A, K>>;
};

export type ValidatorMap<S, A extends Redux.Action> = {
    [K in keyof A]?: Array<Validator<S, A, K>>;
};

export interface ErrorWithLabel extends Error {
    [sym: string]: any;
}

export type InternalTSAError = ErrorWithLabel | string;

export type TSAError =  Error | string;

export type ErrorMap<A extends Redux.Action> = { [K in keyof A]?: TSAError[] };

export interface Failure {
    fieldKey: string;
    error: InternalTSAError;
}

export interface BaseProcessInput<S, A extends Redux.Action> {
    action: A;
    state: S;
    mode: number;
}

export interface AsyncProcessInput<S, A extends Redux.Action> extends BaseProcessInput <S, A> {
    validatorMap: ValidatorMap<S, A>;
}

export interface SyncProcessInput<S, A extends Redux.Action> extends BaseProcessInput <S, A> {
    validatorMap: SyncValidatorMap<S, A>;
}

export interface ErrorMaps<A extends Redux.Action> {
    fieldErrors: ErrorMap<A>;
    processErrors: ErrorMap<A>;
}

export type ProcessOutput<A extends Redux.Action> = ErrorMaps<A> | boolean;

export type ValidationResult = Failure | boolean;

export type FieldValidationResult = ValidationResult[];

export interface ErrorActionHelp<A extends Redux.Action, T extends keyof A> {
    __reduxTSAError__: boolean;
    type: A[T];
    error: boolean;
    fieldErrors: ErrorMap<A> | null;
    processErrors: ErrorMap<A> | null;
}

export type ErrorAction<A extends Redux.Action> = ErrorActionHelp<A, "type">;

export type TSAAction<A extends Redux.Action> = A | ErrorAction<A>;
