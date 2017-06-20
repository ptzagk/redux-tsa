import * as Redux from "redux";

import { State } from "./state";

import * as types from "../../../src/types";

export interface Donation extends Redux.Action {
    name: string;
    amount: number;
}

export function donate(name: string, amount: number): Donation {
    return {
        name,
        amount,
        type: "DONATE",
    };
}

export interface Login extends Redux.Action {
    name: string;
    password: string;
    confirm: string;
}

export function login(name: string, password: string, confirm: string): Login {
    return {
        name,
        confirm,
        password,
        type: "LOGIN",
    };
}
