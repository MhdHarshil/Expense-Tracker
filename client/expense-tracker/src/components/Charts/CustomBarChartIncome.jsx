// import React from 'react'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from 'recharts'

// const CustomBarChartIncome = ({ data = [] }) => {
//   // Function to alternate colors
//   const getBarColor = (index) => (index % 2 === 0 ? '#875cf5' : '#cfbefb')

//   // Flexible key: supports category (expense), source (income), or label (combined)
//   const xKey =
//     data.length > 0
//       ? Object.keys(data[0]).find((key) =>
//           ['category', 'source', 'label', 'month'].includes(key)
//         ) || 'category'
//       : 'category'

//   // Tooltip
//   const BarTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const item = payload[0].payload || {}
//       return (
//         <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
//           <p className='text-xs font-semibold text-purple-800 mb-1'>
//             {item.source || item.category || item.label}
//           </p>
//           <p className='text-sm text-gray-600'>
//             Amount:{' '}
//             <span className='text-sm font-medium text-gray-900'>
//               ${item.amount}
//             </span>
//           </p>
//         </div>
//       )
//     }
//     return null
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className='bg-white mt-6 p-6 flex flex-col justify-center items-center rounded-xl border border-gray-200 shadow-sm'>
//         <p className='text-gray-400 text-sm'>No data available 📉</p>
//       </div>
//     )
//   }

//   return (
//     <div className='bg-white mt-6 rounded-xl shadow-sm border border-gray-200 p-4'>
//       <ResponsiveContainer width='100%' height={300}>
//         <BarChart data={data} barSize={40}>
//           <CartesianGrid strokeDasharray='3 3' vertical={false} />
//           <XAxis
//             dataKey={xKey}
//             tick={{ fontSize: 12, fill: '#555' }}
//             interval={0}
//             angle={-25}
//             textAnchor='end'
//           />
//           <YAxis tick={{ fontSize: 12, fill: '#555' }} />
//           <Tooltip content={<BarTooltip />} />
//           <Bar dataKey='amount' radius={[10, 10, 0, 0]}>
//             {data.map((entry, index) => (
//               <Cell key={index} fill={getBarColor(index)} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default CustomBarChartIncome



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

const CustomBarChartIncome = ({ data = [] }) => {
  // Function to alternate bar colors
  const getBarColor = (index) => (index % 2 === 0 ? '#875cf5' : '#cfbefb')

  // Bar chart tooltip
  const BarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload || {}
      return (
        <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
          <p className='text-xs font-semibold text-purple-800 mb-1'>
            {item.source || item.category || payload[0].name}
          </p>

          <p className='text-sm text-gray-600'>
            Amount:{' '}
            <span className='text-sm font-medium text-gray-900'>
              ${item.amount}
            </span>
          </p>

          {item.date && (
            <p className='text-xs text-gray-400 mt-1'>
              Date: {new Date(item.date).toLocaleDateString()}
            </p>
          )}
        </div>
      )
    }

    return null
  }

  // If there's no data
  if (!data || data.length === 0) {
    return (
      <div className='bg-white mt-6 p-6 flex flex-col justify-center items-center rounded-xl border border-gray-200 shadow-sm'>
        <p className='text-gray-400 text-sm'>No income data available 📉</p>
      </div>
    )
  }

  return (
    <div className='bg-white mt-6 rounded-xl shadow-sm border border-gray-200 p-4'>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          {/* Clean look (no grid lines) */}
          <CartesianGrid stroke='none' />

          {/* X-axis: show income source or category */}
          <XAxis
            dataKey='source'
            tick={{ fontSize: 12, fill: '#555' }}
            stroke='none'
          />

          {/* Y-axis: simple tick styling */}
          <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke='none' />

          {/* Tooltip */}
          <Tooltip content={<BarTooltip />} />

          {/* Bars */}
          <Bar
            dataKey='amount'
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: 'yellow' }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChartIncome
