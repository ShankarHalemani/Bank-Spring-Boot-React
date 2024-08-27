import "./Table.css";

const Table = ({ data, onUpdateCustomer, onDeleteCustomer, onActivateCustomer }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Total Balance</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.firstName}</td>
            <td>{customer.lastName}</td>
            <td>{customer.totalBalance}</td>
            <td>{customer.active ? "Active" : "Inactive"}</td>
            <td className="">
              {customer.active ? (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                      console.log("Customer ID:", customer.id);
                      onUpdateCustomer(customer.id);
                    }}
                    disabled={!customer.active}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    disabled={!customer.active}
                    onClick={() => {
                      onDeleteCustomer(customer.id);
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-success me-2"
                  disabled={customer.active}
                  onClick={() => {
                    onActivateCustomer(customer.id);
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

export default Table;
