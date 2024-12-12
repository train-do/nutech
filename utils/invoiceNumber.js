function generateInvoiceNumber(input) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedInput = String(input).padStart(3, '0');
    return `INV${day}${month}${year}-${formattedInput}`;
}

module.exports = generateInvoiceNumber