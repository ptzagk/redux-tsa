import * as Redux from "redux";
import { isTSAErrorAction } from "redux-tsa";

const initialState = {
    target: "mango",
    transactionType: "DEPOSIT",
    amount: 100,
    errors: {},
};

export default function transactionForm(state = initialState, action) {
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
                return { ...state, errors: action.fieldErrors };
            } else {
                return initialState;
            }
        default:
            return state;
    }
}
