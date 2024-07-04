import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

function App() {
  const [month, setMonth] = useState('03');
  const [combinedData, setCombinedData] = useState(null);

  useEffect(() => {
    fetchCombinedData(month);
  }, [month]);

  const fetchCombinedData = async (selectedMonth) => {
    try {
      const response = await axios.get(`http://localhost:5000/combined-statistics?month=${selectedMonth}`);
      setCombinedData(response.data);
    } catch (error) {
      console.error("Error fetching data ", error);
    }
  };

  return (
    <div className="App">
      <h1>Product Transactions</h1>
      <label>Select Month: 
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </label>
      {combinedData && (
        <>
          <TransactionsTable transactions={combinedData.transactions} />
          <Statistics statistics={combinedData.statistics} />
          <BarChart barChartData={combinedData.barChart} />
          <PieChart pieChartData={combinedData.pieChart} />
        </>
      )}
    </div>
  );
}

export default App;
