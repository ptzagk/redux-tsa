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

type CheckOutput = boolean | object;

export interface CheckInput {
    fieldKey: string;
    field: any;
    action: Action;
    state: object;
}

type SyncCheck = (input: CheckInput) => CheckOutput;

type AsyncCheck = (input: CheckInput) => Promise<CheckOutput>;

type Check = SyncCheck | AsyncCheck;

interface ProduceErrorInput extends CheckInput {
    context: Context;
}

type ProduceError = (input: ProduceErrorInput) => Error;

export interface Validator {
    check: Check;
    error: ProduceError;
}

type LoadedAsyncCheck = () => Promise<CheckOutput>;

type LoadedProduceError = (context: Context) => Error;

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
    state: object;
    mode: number;
    validatorMap: NormalizedValidatorMap;
    validatorKeyMap: ValidatorKeyMap;
}

export interface ProcessErrorOutput {
    fieldErrors: ErrorMap;
    processErrors: ErrorMap;
}

export type ProcessOutput = ProcessErrorOutput | boolean;

export interface ValidationResult {
    checkOutput: Promise<CheckOutput>;
    error: LoadedProduceError;
}

export interface ValidationResultMap {
    [fieldKey: string]: ValidationResult[];
}
