export default function GenerateVisits() {
    const visits = [];

    function getRandomDate() {
        const minDate = new Date('2021-09-15');
        const maxDate = Date.now();
        //const timestamp = Math.floor(Math.random() * maxDate);
        const timestamp = Math.floor(
            Math.random() * (maxDate - minDate.getTime()) + minDate.getTime()
        );
        return new Date(timestamp);
    }
    const visitCount = Math.floor(Math.random() * 20);


    for (let i = 0; i < visitCount; i++) {
        let visit = {}
        visit.date = getRandomDate()
        visit.physician = Math.floor(Math.random() * 10)
        visit.type = Math.random() < 0.5 ? 'live' : 'expost'
        visit.id = Math.floor(Math.random() * 100)
        visits.push(visit);
    }

    visits.sort((a, b) => b - a);

    return visits

}
