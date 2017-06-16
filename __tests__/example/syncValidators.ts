import * as Redux from "redux";

import * as types from "../../src/types";

import { State } from "./state";
import { Donation, Login } from "./actions";


export const reasonable: types.SyncValidator<State, Donation, 'amount'> = {
    check({ field }) {
      return field > 1000;
  },
  error({ fieldKey, field }) {
    return `${field} is not a reasonable ${fieldKey}`;
    },
};

export const even: types.SyncValidator<State, Donation, 'amount'> = {
    check({ field }) {
        return Number.isInteger(field / 2);
    },
    error({ fieldKey }) {
        return `${fieldKey} must be even`;
     }
}

export const longerThanTen: types.SyncValidator<State, Login, 'name' | 'password'> = {
    check({ field }) {
        return field.length > 10;
    },
    error({ fieldKey, field }) {
        return `${fieldKey} must be at more than 10 characters long, it is currently ${field.length}`
     }
 }

export const sweet: types.SyncValidator<State, Login, 'name' | 'password'> = {
    check({ field }) {
        return field.includes("sugar");
    },
    error({ fieldKey, field }) {
        return `${fieldKey} must be sweet, and ${field} does not contain sugar`
    }
}

export const confusedError: types.SyncValidator<State, types.Action, string> = {
    check() {
        return false;
    },
    error() {
        return `${Symbol("there")}`;
    },
}


// export const confusedCheck: {
//       check() {
//           return `${Symbol("there")}`.length > 10;
//       },
//       error() {
//           return "something is wrong"
//       }
//   },
