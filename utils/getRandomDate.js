function getRandomDate() {
    const now = new Date();
    const startOf2021 = new Date('2021-01-01');
    
    // Calculate the maximum number of days back, but not before 2021
    const maxDaysBack = Math.min(Math.floor((now - startOf2021) / (1000 * 60 * 60 * 24)), 365);
    const daysBack = Math.floor(Math.random() * maxDaysBack);
    
    // Calculate the past date
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - daysBack);
    return pastDate;
}

module.exports = getRandomDate;