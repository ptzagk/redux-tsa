import * as React from "react";
import * as Redux from "redux";
import { validate, ValidatorMap } from "redux-tsa";

import { State } from "reducers";
import { even, fundsAvailable, goodPerson, spaceAvailable } from "validators";

export interface Stream extends Redux.Action {
    type:
        "TRANSACTION_FORM_STREAM_NAME" |
        "TRANSACTION_FORM_STREAM_AMOUNT" |
        "TRANSACTION_FORM_STREAM_TRANSACTION_TYPE";
    field: any;
}

export function streamTarget(event: React.ChangeEvent<HTMLSelectElement>): Stream {
    return {
        type: "TRANSACTION_FORM_STREAM_NAME",
        field: event.target.value,
    };
}

export function streamTransactionType(event: React.ChangeEvent<HTMLSelectElement>): Stream {
    return {
        type: "TRANSACTION_FORM_STREAM_TRANSACTION_TYPE",
        field: event.target.value,
    };
}

export function streamAmount(event: React.ChangeEvent<HTMLSelectElement>): Stream {
    return {
        type: "TRANSACTION_FORM_STREAM_AMOUNT",
        field: event.target.value,
    };
}

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface Transaction extends Redux.Action {
    type: TransactionType;
    target: string;
    amount: number;
}

function withdrawal(target: string, amount: number): Transaction {
    const action: Transaction = {
        target,
        amount,
        type: "WITHDRAWAL",
    };

    const validatorMap: ValidatorMap<State, Transaction> = {
        target: [goodPerson],
        amount: [fundsAvailable, even],
    };

    return validate({ action, validatorMap });
}

function deposit(target: string, amount: number): Transaction {
    const action: Transaction = {
        target,
        amount,
        type: "DEPOSIT",
    };

    const validatorMap: ValidatorMap<State, Transaction> = {
        target: [goodPerson],
        amount: [spaceAvailable, even],
    };

    return validate({ action, validatorMap });
}

export function transaction(target: string, transactionType: string, amount: number): Transaction {
    if (transactionType === "WITHDRAWAL") {
        return withdrawal(target, amount);
    } else {
        return deposit(target, amount);
    }
}
