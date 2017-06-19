import * as React from "react";


const AccountList = ({ accounts }) =>
    <div>
        <h2>Accounts</h2>

        <table className="u-full-width">
            <thead>
                <tr>
                    <th>name</th>
                    <th>balance</th>
                </tr>
            </thead>

            <tbody>
                {
                    accounts.map((account, i) =>
                        <tr key={i}>
                            <td>{account.name}</td>
                            <td>{`$${account.balance}`} </td>
                        </tr>,
                )}
            </tbody>

        </table>
    </div>;

export default AccountList
;
