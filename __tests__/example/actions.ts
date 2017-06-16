import * as Redux from "redux";

import { validate, validateSync } from "../../src";

import { reasonable, even, longerThanTen } from "./syncValidators";
import { available } from "./asyncValidators";

import { State } from "./state";
import * as types from "../../src/types";

export interface Donation extends Redux.Action {
    name: string;
    amount: number;
}

export function donate(name: string, amount: number): Donation {
    const action: Donation = {
        name,
        amount,
        type: "DONATE",
    };

    const validatorMap: types.SyncValidatorMap<State, Donation> = {
        amount: [reasonable, even],
    };

    return validateSync({ action, validatorMap });

}

export interface Login extends Redux.Action {
    name: string;
    password: string;
    confirm: string;
}

export function login(name: string, password: string, confirm: string): Login {
    const action: Login = {
        name,
        confirm,
        password,
        type: "LOGIN"
    };

    const validatorMap: types.ValidatorMap<State,Login> = {
        name: [longerThanTen, available],
        password: [longerThanTen],
    };

    return validate({ action, validatorMap });
}
