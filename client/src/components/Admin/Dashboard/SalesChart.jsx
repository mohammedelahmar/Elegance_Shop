import React from 'react';
import PropTypes from 'prop-types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const SalesChart = ({ data }) => {
  // Format date to readable format
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" />
        <YAxis 
          tickFormatter={(value) => `$${value}`} 
        />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Sales']}
          labelFormatter={(value) => `Date: ${value}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          name="Daily Sales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

SalesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      sales: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalesChart;