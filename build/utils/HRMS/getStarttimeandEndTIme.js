export async function getStartandEndTIme(month, year) {
    // const { month, year, utcSec, userId } = request.params;
    // console.log(request.params, "****** params");
    let startDate;
    let endDate;
    let totalNumberOfDays;
    console.log(month, ' Month is ');
    console.log(year, 'Year is ');
    if (month && year) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const monthIndex = months.indexOf(month);
        if (monthIndex !== -1) {
            startDate = new Date(year, monthIndex, 1);
            endDate = new Date(year, monthIndex + 1, 0);
            totalNumberOfDays = endDate.getDate();
            console.log(startDate, 'Starting Date in the start time ');
            console.log(endDate, 'end Date in the end time ');
        }
    }
    else {
        console.log("Invalid parameters");
        return;
    }
    console.log("startTime");
    console.log("endTime");
    const startTime = startDate.setUTCHours(0, 0, 0, 0);
    const endTime = endDate.setUTCHours(23, 59, 59, 999);
    // const startTime = startDate.setHours(0, 0, 0, 0);
    // const endTime = endDate.setHours(23, 59, 59, 999);
    console.log(startTime);
    console.log(endTime);
    return { startTime, endTime };
}
//# sourceMappingURL=getStarttimeandEndTIme.js.map