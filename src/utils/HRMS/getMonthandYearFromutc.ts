export async function getMonthAndYearFromUTC(month: any, year: any) {
    let startDate;
    let endDate;
    let totalNumberOfDays;
    console.log('get Data')
    console.log(month)
    console.log(year)
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
        const months1 = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const monthIndex = month.length===3 ? months1.indexOf(month): months.indexOf(month) ;
        console.log(monthIndex,"monthIndex")
        if (monthIndex !== -1) {
            console.log(startDate)
            console.log(endDate)
            startDate = new Date(year, monthIndex, 1);
            endDate = new Date(year, monthIndex + 1, 0);
            totalNumberOfDays = endDate.getDate();
        }
    } else {
        console.log("Invalid parameters");
        return;
    }

    const startTime = startDate.setHours(0, 0, 0, 0);
    const endTime = endDate.setHours(23, 59, 59, 999);
    console.log(startTime, ' Start Time ')
    console.log(endTime, ' endTime')
    return {
        startTime, endTime
    }

}


