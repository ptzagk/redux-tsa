import * as Redux from "redux";
import { isTSAErrorAction, TSAAction } from "redux-tsa";

import { Stream, Transaction, TransactionType } from "actions/transaction";

export interface TransactionFormState {
    target: string;
    transactionType: TransactionType;
    amount: number;
    errors: object;
}

const initialState: TransactionFormState = {
    target: "mango",
    transactionType: "DEPOSIT",
    amount: 100,
    errors: {},
};

export type Action = Stream | TSAAction<Transaction>;

export default function transactionForm(state = initialState, action: Action): TransactionFormState {
    switch (action.type) {
        case "TRANSACTION_FORM_STREAM_NAME":
            return { ...state, target: action.field };
        case "TRANSACTION_FORM_STREAM_TRANSACTION_TYPE":
            return { ...state, transactionType: action.field };
        case "TRANSACTION_FORM_STREAM_AMOUNT":
            return { ...state, amount: Number(action.field) };
        case "DEPOSIT":
        case "WITHDRAWAL":
            if (isTSAErrorAction(action)) {
                return { ...state, errors: action.fieldErrors! };
            } else {
                return initialState;
            }
        default:
            return state;
    }
}
