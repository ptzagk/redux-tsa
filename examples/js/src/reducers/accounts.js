import * as Redux from "redux";
import { isTSAErrorAction } from "redux-tsa";

const initialState = {
    apple: {
        name: "apple",
        balance: 650,
    },
    grape: {
        name: "grape",
        balance: 1500,
    },
    kiwi: {
        name: "kiwi",
        balance: 94000,
    },
    mango: {
        name: "mango",
        balance: 550,
    },
};

export default function accounts(state = initialState, action) {
    switch (action.type) {
        case "DEPOSIT":
            if (isTSAErrorAction(action)) {
                return state;
            } else {
                return {
                    ...state,
                    [action.target]: {
                        ...state[action.target],
                        balance: state[action.target].balance + action.amount,
                    },
                };
            }
        case "WITHDRAWAL":
            if (isTSAErrorAction(action)) {
                return state;
            } else {
                return {
                    ...state,
                    [action.target]: {
                        ...state[action.target],
                        balance: state[action.target].balance - action.amount,
                    },
                };
            }
        default:
            return state;
    }
}
