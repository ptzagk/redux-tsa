import values from "lodash-es/values";
import { connect } from "react-redux";
import * as Redux from "redux";

import * as transactionActions from "actions/transaction";
import { State } from "reducers";
import { Account } from "reducers/accounts";
import { TransactionFormState } from "reducers/transactionForm";
import TransactionForm from "../components/TransactionForm";

export interface StateFromProps extends TransactionFormState {
    accounts: Account[];
}

function mapStateToProps(state: State): StateFromProps {
    return {
        ...state.transactionForm,
        accounts: values(state.accounts),
    };
}

export interface DispatchProps {
    streamTarget: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    streamTransactionType: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    streamAmount: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    transaction: (target: string, transactionType: transactionActions.TransactionType, amount: number) => void;
}

function mapDispatchToProps(dispatch: Redux.Dispatch<State>): DispatchProps {
    return {
        streamTarget(e) {
            dispatch(transactionActions.streamTarget(e));
        },
        streamTransactionType(e) {
            dispatch(transactionActions.streamTransactionType(e));
        },
        streamAmount(e) {
            dispatch(transactionActions.streamAmount(e));
        },
        transaction(target: string, transactionType: string, amount: number) {
            dispatch(transactionActions.transaction(target, transactionType, amount));
        },
    };
}

export default connect<StateFromProps, DispatchProps, null>(
    mapStateToProps,
    mapDispatchToProps,
)(TransactionForm);
