import { buildErrorMaps, getValidator, getCheckInput } from "../../src/internal/utils/process";
import { processErrorSymbol } from "../../src/internal/symbols";

import state from "../example/state";

import * as types from "../../src/types";

describe("process utils", () => {

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

    describe("getValidator", () => {

        test("throws error if a validatorKey is in both the sync and async validatorMaps", () => {
            const validatorMap: types.ValidatorMap<{}> = {
                sync: {
                    reasonable: {
                        check({ field }) {
                            return field === "love";
                        },
                        error({ field}) {
                            return `${field} is not reasonable`
                        }
                    }
                },
                async: {
                    reasonable: {
                        async check({ field }) {
                            return await new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve(field === "love");
                                })
                            });
                        },
                        error({ field }) {
                            return `${field} is not reasonable`;
                        }
                    }
                }
            }

            expect(() => getValidator(validatorMap, 'reasonable', true))
                .toThrowError("reasonable cannot be in both the syncValidatorMap and the asyncValidatorMap");
        });

        test("throws error if a validatorKey is not in the validatorMap", () => {
            const validatorMap: types.ValidatorMap<{}> = {
                sync: {},
                async: {}
            };

            expect(() => getValidator(validatorMap, 'anything', true))
                .toThrowError("anything not found in the validatorMap");
        });

        test("throws error if an async validatorKey is provided while async=false", () => {
            const validatorMap: types.ValidatorMap<{}> = {
                sync: {},
                async: {
                    reasonable: {
                        async check({ field }) {
                            return await new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve(field === "love");
                                })
                            });
                        },
                        error({ field }) {
                            return `${field} is not reasonable`;
                        }
                    }
                }
            };

            expect(() => getValidator(validatorMap, 'reasonable', false))
                .toThrowError("async process must be on to use an async validator");
        });

        test("gets a sync validator given a proper validatorKey", () => {
            const validatorMap: types.ValidatorMap<{}> = {
                sync: {
                    reasonable: {
                        check({ field }) {
                            return field === "love";
                        },
                        error({ field}) {
                            return `${field} is not reasonable`
                        }
                    }
                },
                async: {}
            };

            expect(getValidator(validatorMap, "reasonable", false)).toBe(validatorMap.sync.reasonable);
        });

        test("gets an async validator given a proper validatorKey", () => {
            const validatorMap: types.ValidatorMap<{}> = {
                sync: {},
                async: {
                    reasonable: {
                        async check({ field }) {
                            return await new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve(field === "love");
                                })
                            });
                        },
                        error({ field }) {
                            return `${field} is not reasonable`;
                        }
                    }
                }
            };

            expect(getValidator(validatorMap, "reasonable", true)).toBe(validatorMap.async.reasonable);
        });
    });

    describe("buildErrorMaps", () => {
        test("builds ErrorMaps", () => {
            const networkError: types.TSAError = Error("server did not respond")
            networkError[processErrorSymbol] = true;

            const failures: types.Failure[] = [
                {
                    fieldKey: "username",
                    error: Error("username is goofy")
                },
                {
                    fieldKey: "username",
                    error: "username is taken"
                },
                {
                    fieldKey: "username",
                    error: networkError
                },
                {
                    fieldKey: "email",
                    error: "email is goofy"
                },
                {
                    fieldKey: "email",
                    error: networkError
                },
                {
                    fieldKey: "password",
                    error: "must be ten characters"
                }
            ];

            const errorMaps = {
                fieldErrors: {
                    username: [ Error("username is goofy"), "username is taken"],
                    email: ["email is goofy"],
                    password: ["must be ten characters"]
                },
                processErrors: {
                    username: [networkError],
                    email: [networkError]
                }
            };

            expect(buildErrorMaps(failures)).toEqual(errorMaps);
        })
    })
})
