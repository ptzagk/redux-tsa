import * as Redux from "redux";

import * as types from "../../src/types";

import { State } from "./state";
import { Donation, Login } from "./actions";

function detectPoetry(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data === "less is more when more is too much") {
                resolve(true);
            } else {
                resolve({
                    example: "less is more when more is too much"
                });
            }
        }, 25);
    });
}

export const poetic: types.AsyncValidator<State, Donation | Login, 'name'> = {
    async check({ field }) {
      return await detectPoetry(field)
  },
    error({ fieldKey, field }) {
      return `${fieldKey} must be poetic: ${field} is not poetic.`;
    }
};

export const available: types.AsyncValidator<State, Login, 'name'> = {
    check({ field }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(field !== "john");
            }, 25)
          });
      },
    error({ field }) {
          return `${field} is unavailable`;
      },
}

export const approved: types.AsyncValidator<State, Login, 'name'> = {
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
