import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js'

Chart.defaults.global.defaultFontColor = 'black';

function getAverageOfStats(data){
    let total = data.reduce((a, b) => a + b);
    return total / data.length;
}

async function getAvgAcc(weaponName){
    let response = await fetch(`http://localhost:8888/avgAcc/${weaponName}`);
    let json = await response.json();
    return json.avg;
}

async function getMostHits(weaponName){
    let response = await fetch(`http://localhost:8888/mostHits/${weaponName}`);
    let json = await response.json();
    return json.mostHits;
}


(async () => {
    try{
        let ctx = document.getElementById('weapon-stats').getContext('2d');
        let url = 'http://localhost:8888/weaponstats';
        let response = await fetch(url);
        let json_data = await response.json();

        let indices = [...json_data.eb.keys()].reverse(); //we can use the indices of any one (they will all be the same, that's how I scrape data)
        if(json_data.lg.length == json_data.eb.length && json_data.lg.length == json_data.rl.length){
            console.log('all good');
        }else{
            throw new Error('got different lengths for lg/eb/rl stats');
        }
        let lgAccuracies = json_data.lg.map(x => x.lg_hit / x.lg_fired * 100);
        let ebAccuracies = json_data.eb.map(x => x.eb_hit / x.eb_fired * 100);
        let rlAccuracies = json_data.rl.map(x => x.rl_hit / x.rl_fired * 100);

        //an idea for the future, I want to graph game length and also show the final score of each game
        //so would require scraping game time and final score, shouldn't be too hard. (could ask asdf about game time)
        //and then storing that in the database

        //another interesting thing would be to parse the date from the file name, and then I could show date ranges
        //but i dont think all demos are timestamped like that and im not sure how I would sure demos that aren't properly timestamped

        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: indices,
                datasets: [
                    {
                        label: 'LG',
                        data: lgAccuracies,
                        fill: false,
                        backgroundColor: [
                            'rgba(255, 235, 0)',
                        ],
                        borderColor: [
                            'rgba(255, 235, 0)',
                        ],
                        borderWidth: 1,
                    },
                    {
                        label: 'EB',
                        data: ebAccuracies,
                        fill: false,
                        backgroundColor: [
                            'rgba(0, 235, 255)',
                        ],
                        borderColor: [
                            'rgba(0, 235, 255)',
                        ],
                        borderWidth: 1,
                    },
                    {
                        label: 'RL',
                        data: rlAccuracies,
                        fill: false,
                        hidden: true,
                        backgroundColor: [
                            'rgba(227, 4, 4)',
                        ],
                        borderColor: [
                            'rgba(227, 4, 4)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Weapon Stats Over Time',
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 100,
                        },
                        gridLines: {
                            display: true,
                            color: 'rgba(11, 10, 7)',
                        },
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false,     
                        },
                    }],
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: (items, data) => {
                            let label;
                            let shots_fired;
                            let shots_hit;
                            let rounded;
                            if(items.datasetIndex == 0){ //lg
                                label = data.datasets[items.datasetIndex].label || '';
                                shots_fired = json_data.lg[items.index].lg_fired;
                                shots_hit = json_data.lg[items.index].lg_hit;
                                rounded = Math.round(items.yLabel * 100) / 100;
                            }else if(items.datasetIndex == 1){ //eb
                                label = data.datasets[items.datasetIndex].label || '';
                                shots_fired = json_data.eb[items.index].eb_fired;
                                shots_hit = json_data.eb[items.index].eb_hit;
                                rounded = Math.round(items.yLabel * 100) / 100;
                            }else if(items.datasetIndex == 2){ //rl
                                label = data.datasets[items.datasetIndex].label || '';
                                shots_fired = json_data.rl[items.index].rl_fired;
                                shots_hit = json_data.rl[items.index].rl_hit;
                                rounded = Math.round(items.yLabel * 100) / 100;
                            }
                            return `${label}: [${shots_hit}/${shots_fired}] ${rounded}%`;
                        }
                    }
                }
            }
        });
        myChart.canvas.parentNode.style.height = "500px";
        myChart.canvas.parentNode.style.width = "1300px";

        //now to update the stats column
        let statsColumn = document.getElementById('weapon-stats-column');
        let avgLg = await getAvgAcc('lg');
        let avgEb = await getAvgAcc('eb');
        let avgRl = await getAvgAcc('rl');

        let mostLg = await getMostHits('lg');
        let mostEb = await getMostHits('eb');
        let mostRl = await getMostHits('rl');

        statsColumn.innerHTML = 
        `<h1>Averages</h1>
        <p1>Average LG: ${avgLg.toFixed(2)}%</p1>
        <p1>Average EB: ${avgEb.toFixed(2)}%</p1>
        <p1>Average RL: ${avgRl.toFixed(2)}%</p1>
        <br>
        <h1>Max Values</h1>
        <p1>Most LG ticks hit: ${mostLg}</p1>
        <p1>Most rails hit: ${mostEb}</p1>
        <p1>Most rockets hit: ${mostRl}</p1>`;

    } catch(err){
        alert(`Hey I got this error: ${err}`);
    }
})();