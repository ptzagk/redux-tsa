import { combineReducers } from "redux";

import accounts from "./accounts";
import transactionForm from "./transactionForm";

export default combineReducers({
    accounts,
    transactionForm,
});
