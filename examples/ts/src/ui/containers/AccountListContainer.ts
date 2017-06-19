import values from "lodash-es/values";
import { connect } from "react-redux";

import { State } from "reducers";
import { Account } from "reducers/accounts";
import AccountList from "../components/AccountList";

export interface StateProps {
    accounts: Account[];
}

function mapStateToProps(state: State): StateProps {
    return {
        accounts: values(state.accounts),
    };
}

export default connect<StateProps, null, null>(
    mapStateToProps,
)(AccountList);
