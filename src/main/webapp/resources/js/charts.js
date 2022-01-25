let _chart_registry = {};

Chart.defaults.plugins.legend.display = false;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.datasets.barThickness = 10;

function makeNeutronChart(id) {
    let ctx = document.getElementById(id).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['N'],
            datasets: [{
                data: [0],
                backgroundColor: [
                    'rgba(70, 145, 139, 0.5)',
                ],
                borderColor: [
                    'rgba(70, 145, 139, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {scales: {y: {min: 0, max: 20}}}
    });

    chart.canvas.parentNode.style.height = '200px';
    chart.canvas.parentNode.style.width = '55px';

    _chart_registry[id] = chart;
}

function makeGammaChart(id) {
    let ctx = document.getElementById(id).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['G'],
            datasets: [{
                data: [0],
                backgroundColor: [
                    'rgba(107, 201, 97, 0.5)',
                ],
                borderColor: [
                    'rgba(107, 201, 97, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {scales: {y: {min:0, max: 200,}}}
    });

    chart.canvas.parentNode.style.height = '200px';
    chart.canvas.parentNode.style.width = '55px';

    _chart_registry[id] = chart;
}

function makeCMChart(id) {
    let ctx = document.getElementById(id).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {scales: {y: {min: 0, max: 25}}}
    });

    chart.canvas.parentNode.style.height = '125px';
    chart.canvas.parentNode.style.width = '175px';

    _chart_registry[id] = chart;
}

// These charts only include a single dataset.  This chart updates only the data attribute.
function updateChartData(id, data) {
    let chart = _chart_registry[id];
    if (chart === undefined) {
        console.log("Chart not found in registry: " + id);
    }
    chart.data.datasets[0].data = data;
    chart.update();
}

export {makeCMChart, makeGammaChart, makeNeutronChart, updateChartData};