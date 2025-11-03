import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'

const CustomBarChart = ({ data }) => {
    // Function to alternate colors (valid 6-digit hex codes)
    const getBarColor = (index) => {
        return index % 2 === 0 ? '#875cf5' : '#cfbefb'
    }

    // Bar-chart specific tooltip
    const BarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload || {}
            return (
                <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                    <p className='text-xs font-semibold text-purple-800 mb-1'>
                        {item.category || payload[0].name}
                    </p>

                    <p className='text-sm text-gray-600'>
                        Amount:{' '}
                        <span className='text-sm font-medium text-gray-900'>${item.amount}</span>
                    </p>
                </div>
            )
        }

        return null
    }

    return (
        <div className='bg-white mt-6'>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke='none' />

                    {/* Use 'category' as X axis because helper prepares category/amount pairs */}
                    <XAxis dataKey='category' tick={{ fontSize: 12, fill: '#555' }} stroke='none' />
                    <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke='none' />

                    <Tooltip content={<BarTooltip />} />

                    <Bar dataKey='amount' fill='#FF8042' radius={[10, 10, 0, 0]} activeDot={{ r: 8, fill: 'yellow' }}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomBarChart
 
