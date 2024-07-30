export const ensureNoQuotes = (str) => {
    return str.replace(/^['"]+|['"]+$/g, '');
}