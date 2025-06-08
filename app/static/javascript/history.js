let allData = [];

async function fetchHistoryData() {
    try {
        const response = await fetch('/history-data');
        const json = await response.json();
        if (json.error) {
            alert("Erro: " + json.error);
            return;
        }
        allData = json.data;
        populateTable(allData);
    } catch (err) {
        alert("Erro ao buscar histórico: " + err);
    }
}

function populateTable(data) {
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const temp = item.temperature != null ? item.temperature.toFixed(1) : '-';
        const humidity = item.humidity != null ? item.humidity.toFixed(1) : '-';
        const soil = item.soil != null ? item.soil.toFixed(1) : '-';
        const airQuality = item.air_quality != null ? item.air_quality : '-';
        const lat = item.latitude || '-';
        const lon = item.longitude || '-';
        const imageHtml = item.url ? `<img src="${item.url}" alt="Imagem" width="50">` : '-';

        const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : '-';

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${timestamp}</td>
            <td>${temp}</td>
            <td>${humidity}</td>
            <td>${soil}</td>
            <td>${airQuality}</td>
            <td>${lat}</td>
            <td>${lon}</td>
            <td>${imageHtml}</td>
        `;

        tbody.appendChild(row);
    });
}

function applyFilters() {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    const startDate = startDateInput ? new Date(startDateInput) : null;
    const endDate = endDateInput ? new Date(endDateInput) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999); // fim do dia

    const filtered = allData.filter(item => {
        if (!item.timestamp) return false;
        const ts = new Date(item.timestamp);
        return (!startDate || ts >= startDate) && (!endDate || ts <= endDate);
    });

    populateTable(filtered);
}

function exportToCSV() {
    let csv = 'Data/Hora,Temperatura (°C),Umidade (%),Solo (%),Qualidade do Ar,Latitude,Longitude,Imagem\n';
    allData.forEach(item => {
        const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : '';
        const temperature = item.temperature != null ? item.temperature.toFixed(1) : '';
        const humidity = item.humidity != null ? item.humidity.toFixed(1) : '';
        const soil = item.soil != null ? item.soil.toFixed(1) : '';
        const airQuality = item.air_quality != null ? item.air_quality : '';
        const latitude = item.latitude || '';
        const longitude = item.longitude || '';
        const url = item.url || '';

        csv += `"${timestamp}","${temperature}","${humidity}","${soil}","${airQuality}","${latitude}","${longitude}","${url}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'historico.csv');
    link.click();
}

fetchHistoryData();
