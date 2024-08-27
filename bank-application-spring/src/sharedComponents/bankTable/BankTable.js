import "./BankTable.css";

const BankTable = ({ data, onUpdateBank, onDeleteBank, onActivateBank }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Abbreviation</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((bank) => (
          <tr key={bank.bankId}>
            <td>{bank.bankId}</td>
            <td>{bank.fullName}</td>
            <td>{bank.abbreviation}</td>
            <td>{bank.active ? "Active" : "Inactive"}</td>
            <td className="">
              {bank.active ? (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      console.log("Bank ID:", bank.bankId);
                      onUpdateBank(bank.bankId);
                    }}
                    disabled={!bank.active}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    disabled={!bank.active}
                    onClick={() => {
                      onDeleteBank(bank.bankId);
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-success me-2"
                  disabled={bank.active}
                  onClick={() => {
                    onActivateBank(bank.bankId);
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

export default BankTable;
