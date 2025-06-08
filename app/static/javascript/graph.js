
let currentPage = 1;
const perPage = 30;
let chart;

async function fetchGraphData(page = 1) {
    try {
        const response = await fetch(`/graph-data?page=${page}&per_page=${perPage}`);
        const json = await response.json();

        if (json.error) {
            alert("Erro: " + json.error);
            return;
        }

        updateChart(json.data);
        document.getElementById("pageNum").textContent = json.page;
        currentPage = json.page;
    } catch (err) {
        alert("Erro ao buscar dados: " + err);
    }
}

function updateChart(data) {
    const labels = data.map(item => new Date(item.timestamp).toLocaleString());
    const temps = data.map(item => item.temperature);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = temps;
        chart.update();
    } else {
        const ctx = document.getElementById('myChart').getContext('2d');
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
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Timestamp'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Temperatura (°C)'
                        }
                    }
                }
            }
        });
    }
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) fetchGraphData(currentPage - 1);
});

document.getElementById('nextPage').addEventListener('click', () => {
    fetchGraphData(currentPage + 1);
});

// Inicializa carregando a página 1
fetchGraphData(1);
