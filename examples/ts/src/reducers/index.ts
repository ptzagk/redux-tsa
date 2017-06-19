import { combineReducers } from "redux";

import accounts, { Accounts } from "./accounts";
import transactionForm, { TransactionFormState } from "./transactionForm";

export interface State {
    accounts: Accounts;
    transactionForm: TransactionFormState;
}

export default combineReducers({
    accounts,
    transactionForm,
});
