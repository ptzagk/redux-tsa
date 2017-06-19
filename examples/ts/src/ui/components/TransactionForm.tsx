import * as React from "react";
import * as Redux from "redux";
import { ErrorMap } from "redux-tsa";

import { Transaction, TransactionType } from "actions/transaction";
import { Account } from "reducers/accounts";

export interface TransactionFormProps {
    target: string;
    transactionType: TransactionType;
    amount: number;
    accounts: Account[];
    errors: ErrorMap<Transaction>;
    streamTarget: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    streamTransactionType: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    streamAmount: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    transaction: (target: string, transactionType: string, amount: number) => void;
}

const TransactionForm: React.SFC<TransactionFormProps> = ({
    accounts,
    amount,
    target,
    errors,
    transactionType,
    streamTarget,
    streamTransactionType,
    streamAmount,
    transaction,
}) =>
    <div>
        <h2>Transaction</h2>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                transaction(target, transactionType, amount);
            }}
        >
            <label> account holder </label>
            <select className="u-full-width" value={target} onChange={streamTarget}>
                {
                    accounts.map(({ name }, i) =>
                        <option key={i} value={name}> {name} </option>
,                    )
                }
            </select>

            <p className="error">{errors.target}</p>

            <label> transaction type </label>
            <select className="u-full-width" value={transactionType} onChange={streamTransactionType}>
                <option value="DEPOSIT">deposit</option>
                <option value="WITHDRAWAL">withdrawal</option>
            </select>

            <label> amount </label>
            <select className="u-full-width" value={amount} onChange={streamAmount}>
                {
                    [100, 500, 1000, 2500, 5000, 10000].map((amountChoice, i) =>
                        <option key={i} value={amountChoice}> {`$${amountChoice}`} </option>,
                    )
                }
            </select>

            <p className="error">{errors.amount}</p>

            <button
                className="button-primary"
                type="submit"
            >
                Submit
            </button>
        </form>
    </div>;

export default TransactionForm;
