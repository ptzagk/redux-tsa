import * as types from "../../src/types";

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

const isReasonable = {
    check({ field }: types.CheckInput): Promise<types.CheckOutput> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (field > 100) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }, 1000);
        });
    },
    error({ fieldKey, field }: types.ProduceErrorInput): types.TSAError {
        return `${field} is more than 100, and that's not a reasonable ${fieldKey}`
    }
};

const isPoetic = {
    async check({ field }: types.CheckInput): Promise<types.CheckOutput> {
        return detectPoetry(field);
    },
    error ({ context }: types.ProduceErrorInput): types.TSAError {
        return `try again after some ${context.juice}`;
    }
}

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
    isReasonable,
    isPoetic,
    isAvailable
};
