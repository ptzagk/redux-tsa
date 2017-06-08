import * as types from "../../src/types";

const isAvailable = {
    check({ field, state}: types.CheckInput): types.CheckOutput {
        if (!state.names || state.names.includes(field)) {
            return false;
        } else {
            return true;
        }
    },
    error({ field, fieldKey }: types.ProduceErrorInput): types.TSAError {
        return `the ${fieldKey}: ${field} is taken`;
    }
}

export default {
    isAvailable
}
