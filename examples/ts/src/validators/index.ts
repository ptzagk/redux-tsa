import { AsyncValidator, SyncValidator } from "redux-tsa";

import { Transaction } from "actions/transaction";
import { backgroundCheck } from "api";
import { State } from "reducers";

export const fundsAvailable: SyncValidator<State, Transaction, "amount"> = {
    check({ field, action, state }) {
        return field < state.accounts[action.target].balance;
    },
    error({ field, action}) {
        return `${action.target} does not have $${field} available`;
    },
};

export const even: SyncValidator<State, Transaction, "amount"> = {
    check({ field }) {
        return Number.isInteger(field / 2);
    },
    error({ fieldKey }) {
        return `${fieldKey} must be even`;
    },
};

export const spaceAvailable: SyncValidator<State, Transaction, "amount"> = {
    check({ field, action, state }) {
        return !(state.accounts[action.target].balance + field > 100000);
    },
    error({ field, action, state }) {
        return `${action.target} can deposit at most $${100000 - state.accounts[action.target].balance}`;
    },
};

export const goodPerson: AsyncValidator<State, Transaction, "target"> = {
    check({ field }) {
        return backgroundCheck(field);
    },
    error({ field }) {
        return `${field} is a criminal`;
    },
};
