export const formatCurrency = (amount: number) => {
    const formattedAmount = parseInt(amount.toString());
    return formattedAmount.toLocaleString();
};