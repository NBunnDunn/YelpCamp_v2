function getRandomDate() {
    const now = new Date();
    const startOf2021 = new Date('2021-01-01');
    
    // Calculate the maximum number of days back, but not before 2021
    const maxDaysBack = Math.min(Math.floor((now - startOf2021) / (1000 * 60 * 60 * 24)), 365);
    const daysBack = Math.floor(Math.random() * maxDaysBack);
    
    // Calculate the past date
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - daysBack);

    // Format the output
    if (daysBack < 7) {
        return `${daysBack} days ago`;
    } else if (daysBack < 14) {
        return '1 week ago';
    } else if (daysBack < 21) {
        return '2 weeks ago';
    } else if (daysBack < 28) {
        return '3 weeks ago';
    } else if (daysBack < 35) {
        return '4 weeks ago';
    } else {
        return `Posted: ${pastDate.toLocaleDateString('en-US')}`; // Formats date as mm/dd/yy
    }
}

module.exports = getRandomDate;