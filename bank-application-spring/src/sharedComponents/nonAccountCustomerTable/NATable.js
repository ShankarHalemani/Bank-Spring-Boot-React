import "./NATable.css";

const NATable = ({ data, onCreateNewAccount, onViewDocument }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.firstName}</td>
            <td>{customer.lastName}</td>
            <td>
              <button
                className="btn btn-primary me-2"
                onClick={() => {
                  console.log("Customer ID:", customer.id);
                  onCreateNewAccount(customer.id);
                }}
              >
                Create Account
              </button>
              <button className="btn btn-secondary" onClick={() => onViewDocument(customer.id)}>
                View Document
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NATable;
