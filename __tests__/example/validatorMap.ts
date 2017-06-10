import * as types from "../../src/types";
import * as Redux from "redux";

import { State } from "./state";


function detectPoetry(data: any): Promise<types.CheckOutput> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if ((typeof data) === "string") {
                return true;
            } else {
                return {
                    juice: "grapefuit"
                };
            }
        }, 1000);
    });
}

const syncValidators: types.SyncValidatorMap<State> = {
  reasonable: {
    check({ field }) {
      return field < 1000;
  },
    error({ fieldKey, field }) {
      return `${field} is not reasonable for ${fieldKey}`;
    },
  },

  even: {
      check({ field }) {
         return Number.isInteger(field / 2);
     },
      error({ fieldKey}) {
          return `${fieldKey} must be even`
      }
  },

  longerThanTen: {
      check({ field }) {
          return field.length > 10;
      },
      error({ fieldKey, field }) {
          return `${fieldKey} must be at more than 10 characters long, it is currently ${field.length}`
      }
  },

  sweet: {
      check({ field }) {
          return field.includes("sugar");
      },
      error({ fieldKey, field }) {
          return `${fieldKey} must be sweet, and ${field} does not contain sugar`
      }
  }

}

const asyncValidators: types.AsyncValidatorMap<State> = {
  poetic: {
    async check({ field }) {
      // isPoetic calls an API that determines if something is poetic
      return await detectPoetry(field)
  },
    error({ fieldKey, field }) {
      return `${fieldKey} must be poetic: ${field} is not poetic`;
    },
  },
}

const validatorMap: types.ValidatorMap<State> = {
  sync: syncValidators,
  async: asyncValidators
}

export default validatorMap;


// unique: {
//     check({ field, action, state }) {
//         return !state[action.kind].includes(field);
//     },
//     error({ field, action}) {
//         return `a ${field}`
//     }
// }
// interface AddNote extends Redux.Action {
//     kind: string;
//     note: string;
// }
