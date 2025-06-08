async function fetchData() {
    try {
        const response = await fetch('/data');  // rota do Flask
        if (!response.ok) {
            console.error("Erro na resposta:", response.status);
            return;
        }
        const data = await response.json();
        console.log("Dados recebidos:", data);

        if (!Array.isArray(data)) {
            console.warn("Dados recebidos não são um array:", data);
            return;
        }

        const last = data[data.length - 1];
        document.getElementById("card-temp").innerText = `Temperatura: ${last.temperature ?? '--'} °C`;
        document.getElementById("card-umid").innerText = `Umidade: ${last.humidity ?? '--'} %`;
        document.getElementById("card-time").innerText = `Horário: ${new Date(last.timestamp).toLocaleString('pt-BR')}`;

        const tbody = document.querySelector("#data-table tbody");
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.temperature ?? "N/A"}</td>
                <td>${item.humidity ?? "N/A"}</td>
                <td>${item.soil ?? "N/A"}</td>
                <td>${item.air_quality ?? "N/A"}</td>
                <td>${item.latitude || "—"}</td>
                <td>${item.longitude || "—"}</td>
                <td>${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">Ver</a>` : "—"}</td>
                <td>${new Date(item.timestamp).toLocaleString('pt-BR')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Erro ao buscar dados:", err);
    }
}

fetchData();
setInterval(fetchData, 5000);
