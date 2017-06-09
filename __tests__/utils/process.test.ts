import { getCheckInput } from "../../src/internal/utils/process";

import state from "../example/state";

import * as types from "../../src/types";

describe("process utilities", () => {

    describe("getCheckInput", () => {
        test("produces checkInput", () => {
            const action: types.Action  = {
                type: "ADD_NOTE",
                note: "less is more if more is too much"
            };

            expect(getCheckInput({ action, state, fieldKey: "note"})).toEqual({
                action,
                state,
                fieldKey: "note",
                field: action["note"]
            });
        })
    });
})
