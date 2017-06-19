import { backgroundCheck } from "api";

export const fundsAvailable = {
    check({ field, action, state }) {
        return field < state.accounts[action.target].balance;
    },
    error({ field, action}) {
        return `${action.target} does not have $${field} available`;
    },
};

export const even = {
    check({ field }) {
        return Number.isInteger(field / 2);
    },
    error({ fieldKey }) {
        return `${fieldKey} must be even`;
    },
};

export const spaceAvailable = {
    check({ field, action, state }) {
        return !(state.accounts[action.target].balance + field > 100000);
    },
    error({ field, action, state }) {
        return `${action.target} can deposit at most $${100000 - state.accounts[action.target].balance}`;
    },
};

export const goodPerson = {
    check({ field }) {
        return backgroundCheck(field);
    },
    error({ field }) {
        return `${field} is a criminal`;
    },
};
