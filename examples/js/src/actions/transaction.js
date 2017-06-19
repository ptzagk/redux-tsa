import * as React from "react";
import * as Redux from "redux";
import { validate } from "redux-tsa";

import { even, fundsAvailable, goodPerson, spaceAvailable } from "validators";

export function streamTarget(event) {
    return {
        type: "TRANSACTION_FORM_STREAM_NAME",
        field: event.target.value,
    };
}

export function streamTransactionType(event) {
    return {
        type: "TRANSACTION_FORM_STREAM_TRANSACTION_TYPE",
        field: event.target.value,
    };
}

export function streamAmount(event) {
    return {
        type: "TRANSACTION_FORM_STREAM_AMOUNT",
        field: event.target.value,
    };
}

function withdrawal(target, amount) {
    const action = {
        amount,
        target,
        type: "WITHDRAWAL",
    };

    const validatorMap = {
        target: [goodPerson],
        amount: [fundsAvailable, even],
    };

    return validate({ action, validatorMap });
}

function deposit(target, amount) {
    const action: Transaction = {
        target,
        amount,
        type: "DEPOSIT",
    };

    const validatorMap = {
        target: [goodPerson],
        amount: [spaceAvailable, even],
    };

    return validate({ action, validatorMap });
}

export function transaction(target, transactionType, amount) {
    if (transactionType === "WITHDRAWAL") {
        return withdrawal(target, amount);
    } else {
        return deposit(target, amount);
    }
}
