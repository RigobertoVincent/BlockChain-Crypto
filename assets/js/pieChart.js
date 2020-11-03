const ctx = document.getElementById('pie-chart');

let dataOptions = {
    datasets: [{
        data: [33,33, 33],
        backgroundColor: ["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'BTC',
        'LTC',
        'ETH'
    ],
};

let options = {
    // no options for now
}

const myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: dataOptions,
    options: options
});


