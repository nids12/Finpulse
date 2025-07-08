// --- FinPulse Dashboard JS: Buy/Sell/Portfolio ---

// --- Search Logic ---
async function searchAndDisplayStock(symbol) {
  const cardsDiv = document.getElementById("cards");
  const stockChart = document.getElementById("stockChart");
  if (!symbol) {
    cardsDiv.innerHTML = "";
    cardsDiv.style.minHeight = "0";
    cardsDiv.style.padding = "0";
    cardsDiv.style.background = "none";
    if (stockChart) stockChart.style.display = "none";
    return;
  }
  cardsDiv.innerHTML = "<div>Loading...</div>";
  cardsDiv.style.minHeight = "180px";
  cardsDiv.style.padding = "";
  cardsDiv.style.background = "";
  if (stockChart) stockChart.style.display = "block";
  let triedSymbols = [];
  let lastError = null;
  // Try symbol as entered, then .NSE, then .BSE
  let searchSymbols = [symbol.toUpperCase()];
  if (!searchSymbols[0].includes(".")) {
    searchSymbols.push(searchSymbols[0] + ".NSE");
    searchSymbols.push(searchSymbols[0] + ".BSE");
  }
  for (let searchSymbol of searchSymbols) {
    triedSymbols.push(searchSymbol);
    try {
      const res = await fetch(
        `${apiBase}/stocks/price?symbol=${encodeURIComponent(searchSymbol)}`
      );
      const data = await res.json();
      if (res.ok && data.price) {
        // Render card
        cardsDiv.innerHTML = `
          <div class="card" id="card-${searchSymbol}">
            <h2>${searchSymbol}</h2>
            <p>Current Price: <b>₹${data.price}</b></p>
            <button class="buy-btn">Buy</button>
            <button class="sell-btn">Sell</button>
          </div>
        `;
        // Attach buy/sell handlers
        document.querySelector(`#card-${searchSymbol} .buy-btn`).onclick = () =>
          buyStock(searchSymbol, data.price);
        document.querySelector(`#card-${searchSymbol} .sell-btn`).onclick =
          () => sellStock(searchSymbol, data.price);
        if (stockChart) stockChart.style.display = "block";
        return;
      } else {
        lastError = data.error || "Stock not found.";
      }
    } catch (err) {
      lastError = "Network error";
    }
  }
  cardsDiv.innerHTML = `<div class='error-msg'>${
    lastError || "Stock not found for: " + triedSymbols.join(", ")
  }</div>`;
  cardsDiv.style.minHeight = "0";
  cardsDiv.style.padding = "0";
  cardsDiv.style.background = "none";
  if (stockChart) stockChart.style.display = "none";
}

// Attach search event
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("symbolInput");
  const stockChart = document.getElementById("stockChart");
  if (stockChart) stockChart.style.display = "none";
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchAndDisplayStock(input.value.trim());
      }
    });
    input.addEventListener("blur", () => {
      if (input.value.trim()) searchAndDisplayStock(input.value.trim());
    });
  }
});
const apiBase = "http://localhost:5000/api";

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// Redirect to login if not authenticated
if (!isAuthenticated()) {
  window.location.replace("/index.html");
} else {
  // Hide dashboard/notes if not authenticated (defensive)
  document.addEventListener("DOMContentLoaded", () => {
    if (!isAuthenticated()) {
      document.body.innerHTML = "";
      window.location.replace("/index.html");
    }
  });
}

// Helper: Auth header
function authHeader() {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// --- Buy/Sell Modal Dialog ---
function showTradeModal(type, symbol, price, onConfirm) {
  // Remove any existing modal
  const old = document.getElementById("trade-modal");
  if (old) old.remove();
  // Create modal
  const modal = document.createElement("div");
  modal.id = "trade-modal";
  modal.innerHTML = `
    <div class="trade-modal-backdrop"></div>
    <div class="trade-modal-content">
      <h2>${type === "buy" ? "Buy" : "Sell"} ${symbol}</h2>
      <div>Price: <b>₹${price}</b></div>
      <label>Quantity: <input id="trade-qty" type="number" min="1" style="width:60px;" /></label>
      <div class="trade-modal-actions">
        <button id="trade-confirm">${type === "buy" ? "Buy" : "Sell"}</button>
        <button id="trade-cancel">Cancel</button>
      </div>
      <div id="trade-error" style="color:#d32f2f;margin-top:8px;"></div>
    </div>
  `;
  document.body.appendChild(modal);
  // Style
  Object.assign(modal.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
  });
  const content = modal.querySelector(".trade-modal-content");
  Object.assign(content.style, {
    background: "#fff",
    borderRadius: "12px",
    padding: "2em",
    maxWidth: "320px",
    margin: "10vh auto",
    boxShadow: "0 4px 32px #0002",
    position: "relative",
  });
  modal.querySelector(".trade-modal-backdrop").style.cssText =
    "position:absolute;top:0;left:0;width:100vw;height:100vh;background:#0004;";
  // Handlers
  modal.querySelector("#trade-cancel").onclick = () => modal.remove();
  modal.querySelector("#trade-confirm").onclick = () => {
    const qty = parseInt(modal.querySelector("#trade-qty").value, 10);
    if (!qty || qty <= 0) {
      modal.querySelector("#trade-error").textContent =
        "Enter a valid quantity.";
      return;
    }
    onConfirm(
      qty,
      () => modal.remove(),
      (err) => {
        modal.querySelector("#trade-error").textContent =
          err || "Trade failed.";
      }
    );
  };
}

// --- Buy/Sell Handlers (with modal) ---
async function buyStock(symbol, price) {
  showTradeModal("buy", symbol, price, async (qty, close, showError) => {
    try {
      const res = await fetch(apiBase + "/stocks/buy", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ symbol, quantity: qty, price }),
      });
      const data = await res.json();
      if (!res.ok) return showError(data.error || "Buy failed");
      alert("Buy successful!");
      close();
      fetchPortfolio();
    } catch (e) {
      showError("Network error");
    }
  });
}

async function sellStock(symbol, price) {
  showTradeModal("sell", symbol, price, async (qty, close, showError) => {
    try {
      const res = await fetch(apiBase + "/stocks/sell", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ symbol, quantity: qty, price }),
      });
      const data = await res.json();
      if (!res.ok) return showError(data.error || "Sell failed");
      alert("Sell successful!");
      close();
      fetchPortfolio();
    } catch (e) {
      showError("Network error");
    }
  });
}

// --- Portfolio Fetch/Render ---
async function fetchPortfolio() {
  const res = await fetch(apiBase + "/stocks/portfolio", {
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) return;
  renderPortfolio(data.holdings);
  renderTransactions(data.transactions);
}

function renderPortfolio(holdings) {
  const tbody = document.querySelector("#portfolio-table tbody");
  tbody.innerHTML = "";
  if (!holdings.length) {
    tbody.innerHTML = '<tr><td colspan="3">No holdings</td></tr>';
    return;
  }
  holdings.forEach((h) => {
    tbody.innerHTML += `<tr><td>${h.symbol}</td><td>${
      h.quantity
    }</td><td>${h.avgPrice.toFixed(2)}</td></tr>`;
  });
}

function renderTransactions(transactions) {
  const tbody = document.querySelector("#transactions-table tbody");
  tbody.innerHTML = "";
  if (!transactions.length) {
    tbody.innerHTML = '<tr><td colspan="5">No transactions</td></tr>';
    return;
  }
  transactions
    .slice()
    .reverse()
    .forEach((t) => {
      const d = new Date(t.date).toLocaleString();
      tbody.innerHTML += `<tr><td>${d}</td><td>${t.type}</td><td>${
        t.symbol
      }</td><td>${t.quantity}</td><td>${t.price.toFixed(2)}</td></tr>`;
    });
}

// --- Portfolio Value Chart ---
let portfolioValueChart;

function renderPortfolioValueChart(transactions) {
  // Calculate portfolio value over time
  let value = 0;
  let shares = {};
  const dataPoints = [];
  const sorted = transactions
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  sorted.forEach((t) => {
    if (t.type === "buy") {
      shares[t.symbol] = (shares[t.symbol] || 0) + t.quantity;
      value += t.quantity * t.price;
    } else if (t.type === "sell") {
      shares[t.symbol] = (shares[t.symbol] || 0) - t.quantity;
      value -= t.quantity * t.price;
    }
    dataPoints.push({ x: new Date(t.date), y: value });
  });
  // If no transactions, show empty chart
  if (!dataPoints.length) {
    dataPoints.push({ x: new Date(), y: 0 });
  }
  // Create or update chart
  const ctx = document.getElementById("portfolioValueChart").getContext("2d");
  if (portfolioValueChart) {
    portfolioValueChart.data.datasets[0].data = dataPoints;
    portfolioValueChart.update();
  } else {
    portfolioValueChart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Portfolio Value",
            data: dataPoints,
            borderColor: "#007bff",
            backgroundColor: "rgba(0,123,255,0.08)",
            fill: true,
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Portfolio Value Over Time" },
        },
        scales: {
          x: {
            type: "time",
            time: { unit: "day" },
            title: { display: true, text: "Date" },
          },
          y: { title: { display: true, text: "Value (₹)" }, beginAtZero: true },
        },
      },
    });
  }
}

// Patch fetchPortfolio to also update the chart
const origRenderTransactions = renderTransactions;
renderTransactions = function (transactions) {
  origRenderTransactions(transactions);
  renderPortfolioValueChart(transactions);
};

// --- Patch: Add Buy/Sell buttons to stock cards ---
// (Assumes createOrUpdateCard is called for each stock)
const origCreateOrUpdateCard = window.createOrUpdateCard;
window.createOrUpdateCard = function (stockData) {
  origCreateOrUpdateCard(stockData);
  const { symbol, current } = stockData;
  const card = document.getElementById(`card-${symbol}`);
  if (card && !card.querySelector(".buy-btn")) {
    const buyBtn = document.createElement("button");
    buyBtn.textContent = "Buy";
    buyBtn.className = "buy-btn";
    buyBtn.onclick = () => buyStock(symbol, current);
    const sellBtn = document.createElement("button");
    sellBtn.textContent = "Sell";
    sellBtn.className = "sell-btn";
    sellBtn.onclick = () => sellStock(symbol, current);
    card.appendChild(buyBtn);
    card.appendChild(sellBtn);
  }
};

// --- User Info & Logout ---
async function fetchAndShowUsername() {
  try {
    const res = await fetch(apiBase + "/auth/me", { headers: authHeader() });
    if (!res.ok) throw new Error();
    const data = await res.json();
    document.getElementById("username").textContent = data.username;
  } catch {
    document.getElementById("username").textContent = "User";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndShowUsername();
  fetchPortfolio();
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      console.log("Logout button clicked");
      localStorage.removeItem("token");
      // Optionally clear UI
      document.body.innerHTML = "";
      window.location.replace("/index.html");
    };
  }
});
// Fallback: Attach logout handler in case DOMContentLoaded is too late
setTimeout(() => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn && !logoutBtn.onclick) {
    logoutBtn.onclick = function () {
      console.log("Logout button clicked (fallback)");
      localStorage.removeItem("token");
      document.body.innerHTML = "";
      window.location.replace("/index.html");
    };
  }
}, 1000);

// Global event listener for logout button
// This will catch all clicks on the logout button, no matter when it is rendered

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "logout-btn") {
    console.log("Global: Logout button clicked");
    localStorage.removeItem("token");
    document.body.innerHTML = "";
    window.location.replace("/index.html");
  }
});
