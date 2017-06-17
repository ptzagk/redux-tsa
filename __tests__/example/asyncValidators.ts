import * as Redux from "redux";

import * as types from "../../src/types";

import { State } from "./state";
import { Donation, Login } from "./actions";

function detectPoetry(data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data.includes("rain"));
        }, 25);
    });
}

export const poetic: types.AsyncValidator<State, Donation | Login, 'name'> = {
    async check({ field }) {
      return await detectPoetry(field)
  },
    error({ fieldKey, field }) {
      return `${fieldKey} must be poetic: ${field} is not poetic`;
    }
};

export const approved: types.AsyncValidator<State, Login, 'name' | 'password'> = {
    check({ field, action }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(!field.includes("grape"));
            }, 25);
        })
    },
    error() {
        return "the authority declines the transaction"
    }
}
