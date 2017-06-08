import syncValidators from "./syncValidators";
import asyncValidators from "./asyncValidators";

import * as types from "../../src/types";

export default {
    sync: syncValidators as types.SyncValidatorMap,
    async: asyncValidators as types.AsyncValidatorMap
}
