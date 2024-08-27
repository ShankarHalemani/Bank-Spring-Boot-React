import "./AccountTable.css";

const AccountTable = ({ data, onDeleteAccount, onActivateAccount }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Account Number</th>
          <th>Balance</th>
          <th>Bank Name</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((account) => (
          <tr key={account.accountNumber}>
            <td>{account.accountNumber}</td>
            <td>{account.balance}</td>
            <td>{account.bankResponseDTO.fullName}</td>
            <td>{account.active ? "Active" : "Inactive"}</td>
            <td>
              {account.active ? (
                <button
                  type="button"
                  className="btn btn-danger me-2"
                  onClick={() => {
                    onDeleteAccount(account.accountNumber);
                  }}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={() => {
                    onActivateAccount(account.accountNumber);
                  }}
                >
                  Activate
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccountTable;
