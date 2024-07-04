import React from 'react';

function PieChart({ pieChartData }) {
  return (
    <div>
      <h2>Category Pie Chart</h2>
      <ul>
        {pieChartData.map(data => (
          <li key={data.category}>{data.category}: {data.count}</li>
        ))}
      </ul>
    </div>
  );
}

export default PieChart;
