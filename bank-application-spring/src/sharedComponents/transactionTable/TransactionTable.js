import "./TransactionTable.css";

const TransactionTable = ({ data }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Sender Account</th>
          <th>Reciever Account</th>
          <th>Amount Transferred</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((transaction) => (
          <tr key={transaction.transactionId}>
            <td>{transaction.transactionId}</td>
            <td>{transaction.senderAccountNumber}</td>
            <td>{transaction.receiverAccountNumber}</td>
            <td>{transaction.amount}</td>
            <td>{new Date(transaction.transactionTimestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
