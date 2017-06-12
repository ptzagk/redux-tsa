import * as types from "../../src/types";
import * as Redux from "redux";

import { State } from "./state";


function detectPoetry(data: any): Promise<types.CheckOutput> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data === "less is more when more is too much") {
                return true;
            } else {
                return {
                    example: "less is more when more is too much"
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
  },

  confusedCheck: {
      check() {
          return { hint: `${Symbol("there")}`};
      },
      error() {
          return "something is wrong"
      }
  },

  confusedError: {
      check() {
          return false;
      },
      error() {
          return `${Symbol("there")}`;
      }
  }
}

const asyncValidators: types.AsyncValidatorMap<State> = {
  poetic: {
    async check({ field }) {
      // isPoetic calls an API that determines if something is poetic
      return await detectPoetry(field)
  },
    error({ fieldKey, field, context: { example } }) {
      return `${fieldKey} must be poetic: ${field} is not poetic. ${example} is poetic`;
    },
  },
  available: {
      check({ field }) {
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve(field !== "john");
              }, 1000)
            });
        },
      error({ field }) {
            return `${field} is unavailable`;
        },
    },
    approved: {
        check({ field, action }) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(field > 150 && action.username.contains("grape"));
                }, 1000);
            });
        },
        error() {
            return "the authority declines the trasnaction"
        }
    }
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
