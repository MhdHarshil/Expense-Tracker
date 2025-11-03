import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'
import { useState } from 'react'
import { useEffect } from 'react';

const CS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({data, totalIncome}) => {

    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        if (!data || !data.length) return;

        const dataArr = data.map((item) => ({
            name: item?.source,
            amount: item?.amount
        }));

        setChartData(dataArr);
    };

    useEffect(() => {
        prepareChartData();

        console.log('chartData:', chartData);
    }, [data]);

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Last 60 Days Income</h5>
        </div>

        <CustomPieChart
            data={chartData}
            label='Total Income'
            totalAmount={`$${totalIncome}`}
            showTextAnchor
            colors={CS}
        />
    </div>
  )
}

export default RecentIncomeWithChart
