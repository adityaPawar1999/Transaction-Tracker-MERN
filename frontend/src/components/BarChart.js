import React from 'react';

function BarChart({ barChartData }) {
  return (
    <div>
      <h2>Price Range Bar Chart</h2>
      <ul>
        {Object.keys(barChartData).map(range => (
          <li key={range}>{range}: {barChartData[range]}</li>
        ))}
      </ul>
    </div>
  );
}

export default BarChart;
