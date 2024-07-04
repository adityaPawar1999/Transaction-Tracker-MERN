import React from 'react';

function TransactionsTable({ transactions }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Date of Sale</th>
                    <th>Sold</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.title}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.price}</td>
                        <td>{transaction.category}</td>
                        <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        <td>{transaction.sold ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TransactionsTable;
