# Sistema de Monitoramento Ambiental

Este projeto tem como objetivo o **monitoramento de variáveis ambientais** (temperatura, umidade, solo, qualidade do ar) por meio de um dispositivo ESP32 com sensores, envio dos dados para uma API Flask e exibição em um painel web com **gráficos, histórico e alertas**.

---

## 📸 Ilustração da Solução

![fluxo-geral](esp32/circuit.png)  
*Exemplo de fluxo: ESP32 → Node-RED → API Flask → Armazenamento + Interface Web*

---

## 🧾 Descrição da Solução

- Dispositivo **ESP32** com sensores lê os dados do ambiente em tempo real.
- Os dados são enviados via **Node-RED**.
- A API salva os logs com timestamp, local (latitude/longitude), imagem associada ao alerta.
- A interface web mostra:
  - Painel de gráficos dos dados.
  - Página de histórico com paginação.
  - Página com os logs registrados, com imagens.

---

## 🛠️ Estrutura do Projeto

```bash
/
├── app/                           # Código principal da aplicação Flask
│   ├── __pycache__/               # Arquivos de cache do Python
│   ├── static/                    # Arquivos estáticos (JS e CSS)
│   │   ├── css/                   # Arquivos CSS
│   │   │   └── styles.css         # Estilização do sistema
│   │   ├── javascript/            # Arquivos JS
│   │   │   ├── graph.js           # Exibição de gráficos
│   │   │   ├── history.js         # Gerenciamento de histórico
│   │   │   └── script.js          # Dashboard de logs
│   ├── templates/                 # Arquivos HTML
├── data/                          # Arquivos JSON e dados
│   └── log.json                   # Logs recebidos do ESP32
├── esp32/                         # Informações sobre o ESP32
│   ├── circuit.png                # Imagem do circuito
│   └── main.ino                   # Código do ESP32
├── mqtt_bridge.py                 # Bridge para conexão MQTT
├── nodered.json                   # Fluxo exportado do Node-RED
├── readme.md                      # Documentação do projeto
├── requirements.txt               # Dependências do projeto
└── run.py                         # Arquivo principal de execução do sistema
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 
- [Git](https://git-scm.com/)
- Editor de código (como o [VS Code](https://code.visualstudio.com/))

### 1. Clone o repositório
```bash
git clone https://github.com/30Lima/The-Guardians-eye-iot.git
cd The-Guardians-eye-iot
```

### 2. Instale as dependências
```bash
pip install flask
pip install paho-mqtt
pip install requests
npm install -g node-red
```
### 3. Rode o node-RED
```bash
node-red
```

### 4. Ainda no node-RED, importe o arquivo JSON 
![clique aqui](nodered.json)

### 5. Acesse o sistema do ESP32 na plataforma wowki
```bash
https://wokwi.com/projects/433090140394028033
```
### 6. Execute o sistema do ESP32
![image](https://github.com/user-attachments/assets/bfff0a68-dfa1-452b-8aeb-a3d0dec4c10c)

### 7. No terminal do vscode(ou a sua IDE), execute
```bash
run.py
```

### 8. Acesse o localhost(foi exibido no seu terminal) e veja o sistema funcioando


































