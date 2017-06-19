import values from "lodash-es/values";
import { connect } from "react-redux";

import AccountList from "../components/AccountList";

function mapStateToProps(state) {
    return {
        accounts: values(state.accounts),
    };
}

export default connect(
    mapStateToProps,
)(AccountList);
