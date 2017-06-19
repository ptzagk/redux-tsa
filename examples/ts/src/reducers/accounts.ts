import * as Redux from "redux";
import { isError, TSAAction } from "redux-tsa";

import { Transaction } from "actions/transaction";

export interface Account {
    name: string;
    balance: number;
}

export interface Accounts {
    [name: string]: Account;
}

const initialState: Accounts = {
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

export type Action = TSAAction<Transaction>;

export default function accounts(state: Accounts = initialState, action: Action): Accounts {
    switch (action.type) {
        case "DEPOSIT":
            if (isError(action)) {
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
            if (isError(action)) {
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
