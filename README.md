# ⚡ RadarPilot · Copiloto de Radares & Velocidade Média

<div align="center">
  <img src="icon.svg" width="140" height="140" alt="RadarPilot Icon" />
  <p><strong>Copiloto inteligente com 21.600+ radares de todo o Brasil (fixos, semáforos e velocidade média), cálculo em tempo real, integração com Waze & Google Maps e Janela Flutuante (Picture-in-Picture).</strong></p>
</div>

---

## 🚀 Funcionalidades

- **Base Nacional de Radares (21.600+ radares):**
  - Mapeamento completo de rodovias federais e estaduais (DNIT, ANTT, Inmetro, Prefeituras e OpenStreetMap).
  - Alerta antecipado para **todos os radares fixos** e **semáforos com radar** a 500m.
  - Alerta antecipado sonoro, por vibração e voz em português (PT-BR).
- **Cálculo de Velocidade Média em Tempo Real:**
  - Mais de 400 trechos de velocidade média mapeados no Brasil.
  - Inicia a contagem exata no Ponto A e encerra no Ponto B.
  - Velocímetro dinâmico com indicador verde / amarelo / vermelho.
  - **Velocidade Máxima Restante:** Calcula exatamente a velocidade permitida no trecho restante para não tomar multa.
- **Janela Flutuante (Picture-in-Picture):** Projeta um mini-painel HUD flutuante sobreposto em cima do Waze e Google Maps no smartphone.
- **Integração 1-Toque com Waze & Google Maps:** Traça a rota e abre o app oficial enquanto o RadarPilot monitora a velocidade média em segundo plano.
- **Busca de Endereços:** Digite qualquer destino ou selecione chips rápidos (Imigrantes, BR-040, Ponte Rio-Niterói, Av. Paulista).
- **Simulação com 1 Toque:** Botão `▶ Simular` direto no HUD para testar o funcionamento imediatamente.
- **PWA (Progressive Web App):** Instalável no Android e iOS, com funcionamento 100% offline após baixado.
- **Keep Screen Awake (Wake Lock):** Mantém a tela ligada durante a condução.

---

## 🛠️ Como Rodar Localmente

### Opção 1: Windows (Automático)
Dê um duplo clique no arquivo `start-server.bat`.

### Opção 2: Terminal
```bash
node server.js
```
Acesse: `http://localhost:8000`

---

## 📡 Atualização da Base de Radares
Para atualizar a base com os dados mais recentes do OpenStreetMap e dados abertos:
```bash
node build-radars.js
```
