import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js'

let ctx = document.getElementById('the-chart').getContext('2d');
let ctx2 = document.getElementById('other-chart').getContext('2d');

function drawOtherGraph(){
    let myChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [new Date(2020, 10, 1), new Date(2020, 10, 2), new Date(2020, 10, 3)],
            datasets: [{
                label: 'TEST',
                data: [5,6,7],
                fill: false,
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                }],
            },
        },
    });

    myChart.canvas.parentNode.style.height = "500px";
    myChart.canvas.parentNode.style.width = "900px";
}

drawOtherGraph();

(async () => {

    let url = 'http://localhost:8888/';
    let response = await fetch(url);
    let json_data = await response.json();
    console.log(`json data from ${url} :`);
    console.log(json_data);
    let indices = [...json_data.keys()].reverse();
    // console.log([...json _data.keys()].reverse());
    let accuracies = json_data.map(x => x.eb_hit / x.eb_fired * 100);

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: indices,
            datasets: [{
                label: 'EB',
                data: accuracies,
                fill: false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 99, 132, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                    }
                }]
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: (items, data) => {
                        let label = data.datasets[items.datasetIndex].label || '';
                        let shots_fired = json_data[items.index].eb_fired;
                        let shots_hit = json_data[items.index].eb_hit;
                        let rounded = Math.round(items.yLabel * 100) / 100;
                        return `${label}: [${shots_hit}/${shots_fired}] ${rounded}%`;
                    }
                }
            }
        }
    });
    myChart.canvas.parentNode.style.height = "300px";
    myChart.canvas.parentNode.style.width = "900px";
})();