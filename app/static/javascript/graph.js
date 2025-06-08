document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const perPage = 30;
    let chart, soilChart, airChart, humidityChart;

    async function fetchGraphData(page = 1) {
        try {
            const response = await fetch(`/graph-data?page=${page}&per_page=${perPage}`);
            const json = await response.json();

            if (json.error) {
                alert("Erro: " + json.error);
                return;
            }

            updateCharts(json.data);
            document.getElementById("pageNum").textContent = json.page;
            currentPage = json.page;
        } catch (err) {
            alert("Erro ao buscar dados: " + err);
        }
    }

    function updateCharts(data) {
        const labels = data.map(item => new Date(item.timestamp).toLocaleString());
        const temps = data.map(item => item.temperature);
        const humidity = data.map(item => item.humidity);
        const soil = data.map(item => item.soil);
        const air = data.map(item => item.air_quality);

        // Temperatura
        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = temps;
            chart.update();
        } else {
            const ctx = document.getElementById('tempChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperatura (°C)',
                        data: temps,
                        borderColor: 'rgba(42, 157, 143, 1)',
                        backgroundColor: 'rgba(42, 157, 143, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                    }]
                },
                options: getChartOptions('Timestamp', 'Temperatura (°C)')
            });
        }

        // Umidade
        if (humidityChart) {
            humidityChart.data.labels = labels;
            humidityChart.data.datasets[0].data = humidity;
            humidityChart.update();
        } else {
            const humidityCtx = document.getElementById('humidityChart').getContext('2d');
            humidityChart = new Chart(humidityCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Umidade (%)',
                        data: humidity,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                    }]
                },
                options: getChartOptions('Timestamp', 'Umidade (%)')
            });
        }


        // Solo
        if (soilChart) {
            soilChart.data.labels = labels;
            soilChart.data.datasets[0].data = soil;
            soilChart.update();
        } else {
            const soilCtx = document.getElementById('soilChart').getContext('2d');
            soilChart = new Chart(soilCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Umidade do Solo (%)',
                        data: soil,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                    }]
                },
                options: getChartOptions('Timestamp', 'Umidade do Solo (%)')
            });
        }

        // Qualidade do Ar
        if (airChart) {
            airChart.data.labels = labels;
            airChart.data.datasets[0].data = air;
            airChart.update();
        } else {
            const airCtx = document.getElementById('airChart').getContext('2d');
            airChart = new Chart(airCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Qualidade do Ar (PPM)',
                        data: air,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                    }]
                },
                options: getChartOptions('Timestamp', 'Qualidade do Ar (PPM)')
            });
        }
    }

    function getChartOptions(xLabel, yLabel) {
        return {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: xLabel
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yLabel
                    }
                }
            }
        };
    }

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) fetchGraphData(currentPage - 1);
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        fetchGraphData(currentPage + 1);
    });

    fetchGraphData(1);

});
