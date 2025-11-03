import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const addThoudandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const fromattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart
        ? `${fromattedInteger}.${fractionalPart}`
        : fromattedInteger;
};


export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount
    }));

    return chartData;
};


export const prepareIncomeBarChartData = (data = []) => {

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('MMM Do'),
        amount: item?.amount,
        source: item?.source,
    }));

    return chartData;
};

// export const prepareIncomeBarChartData = (data) => {
//   if (!Array.isArray(data)) {
//     console.error("❌ Expected an array but got:", data);
//     return [];
//   }

//   const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

//   return sortedData.map((item) => ({
//     month: moment(item?.date).format("Do MMM"), // e.g., "5th Nov"
//     amount: item?.amount || 0,
//     source: item?.source || "Unknown",
//   }));
// };


export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        category: item?.category,
    }));

    return chartData;
};