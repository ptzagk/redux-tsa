import * as React from "react";

import AccountListContainer from "../containers/AccountListContainer";
import TransactionFormContainer from "../containers/TransactionFormContainer";

export default () =>
    <div className="app">
        <TransactionFormContainer />
        <AccountListContainer />
    </div>;
