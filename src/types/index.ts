interface GenericObject {
    [key: string]: any;
}

export interface Action {
    type: any;
    [fieldKey: string]: any;
}

export type State = GenericObject;


export interface ValidatorKeyMap {
    [fieldKey: string]: string[];
}

export interface Context {
    [key: string]: any;
}

export type CheckOutput = boolean | object;

export interface CheckInput {
    fieldKey: string;
    field: any;
    action: Action;
    state: State;
}

type SyncCheck = (input: CheckInput) => CheckOutput;

type AsyncCheck = (input: CheckInput) => Promise<CheckOutput>;

type Check = SyncCheck | AsyncCheck;

export interface ProduceErrorInput extends CheckInput {
    context: Context;
}

type ProduceError = (input: ProduceErrorInput) => TSAError;

export interface Validator {
    check: Check;
    error: ProduceError;
}

type LoadedAsyncCheck = () => Promise<CheckOutput>;

type LoadedProduceError = (context: Context) => TSAError;

export interface LoadedNormalizedValidator {
    check: LoadedAsyncCheck;
    error: LoadedProduceError;
}

export interface NormalizedValidator {
    check: AsyncCheck;
    error: ProduceError;
}

export interface ValidatorMap {
    [key: string]: Validator;
}

export interface NormalizedValidatorMap {
    [key: string]: NormalizedValidator;
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

export type OnError = (type: string, fieldErrors: ErrorMap, processErrors: ErrorMap) => Action;

export interface MiddlewareConfig {
    validatorMap: ValidatorMap;
    onError: OnError;
}

export interface ProcessInput {
    action: Action;
    state: State;
    mode: number;
    validatorMap: NormalizedValidatorMap;
    validatorKeyMap: ValidatorKeyMap;
}

export interface ErrorMaps {
    fieldErrors: ErrorMap;
    processErrors: ErrorMap;
}

export type ProcessOutput = ErrorMaps | boolean;

export type ValidationResult = TSAError | boolean;

export interface FieldValidationResult {
    results: ValidationResult[];
    fieldKey: string;
}

export type ActionValidationResult = FieldValidationResult[];
