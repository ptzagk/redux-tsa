import * as types from "../../src/types";

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
      return `${field} is not a reasonable for ${field}`;
    },
  },

  longerThanTen: {
      check({ field }) {
          return field.length > 10;
      },
      error({ fieldKey, field }) {
          return `${fieldKey} must be at least 10 characters long, it is current ${field.length}`
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
