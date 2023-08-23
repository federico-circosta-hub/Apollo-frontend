export default function GenerateVisits() {
    const visits = [];

    function getRandomDate() {
        const minDate = new Date('2019-01-01');
        const maxDate = Date.now();
        //const timestamp = Math.floor(Math.random() * maxDate);
        const timestamp = Math.floor(
            Math.random() * (maxDate - minDate.getTime()) + minDate.getTime()
        );
        return new Date(timestamp);
    }
    const visitCount = Math.floor(Math.random() * 20);


    for (let i = 0; i < visitCount; i++) {
        const visit = getRandomDate()
        visits.push(visit);
    }



    return visits

}
