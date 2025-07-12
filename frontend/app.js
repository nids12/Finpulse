// --- Multi-Watchlist Logic ---
let allWatchlists = [];
let currentWatchlist = null;

async function fetchWatchlists() {
  const section = document.getElementById("watchlist-section");
  const select = document.getElementById("watchlist-select");
  const container = document.getElementById("watchlist-cards");
  const title = document.getElementById("watchlist-title");
  if (!container || !section || !select || !title) return;
  showLoader();
  try {
    const res = await fetch(apiBase + "/stocks/watchlists", {
      headers: authHeader(),
    });
    const data = await res.json();
    if (!res.ok || !Array.isArray(data.watchlists)) {
      container.innerHTML =
        '<div class="error-msg">Failed to load watchlists.</div>';
      hideLoader();
      return;
    }
    allWatchlists = data.watchlists;
    // Populate dropdown
    select.innerHTML = "";
    if (!allWatchlists.length) {
      select.innerHTML = '<option value="">No Watchlists</option>';
      container.innerHTML =
        '<div class="empty-msg">No watchlists found. Create one!</div>';
      title.textContent = "Your Watchlist";
      currentWatchlist = null;
      hideLoader();
      return;
    }
    allWatchlists.forEach((wl, i) => {
      const opt = document.createElement("option");
      opt.value = wl.name;
      opt.textContent = wl.name;
      select.appendChild(opt);
    });
    // Select first by default if none selected
    if (
      !currentWatchlist ||
      !allWatchlists.some((wl) => wl.name === currentWatchlist)
    ) {
      currentWatchlist = allWatchlists[0].name;
    }
    select.value = currentWatchlist;
    renderCurrentWatchlist();
  } catch (e) {
    container.innerHTML =
      '<div class="error-msg">Failed to load watchlists.</div>';
  }
  hideLoader();
}

function renderCurrentWatchlist() {
  const container = document.getElementById("watchlist-cards");
  const title = document.getElementById("watchlist-title");
  if (!container || !title) return;
  const wl = allWatchlists.find((wl) => wl.name === currentWatchlist);
  if (!wl) {
    container.innerHTML = '<div class="empty-msg">No watchlist selected.</div>';
    title.textContent = "Your Watchlist";
    return;
  }
  title.textContent = wl.name;
  if (!wl.symbols.length) {
    container.innerHTML = `
      <div class="empty-msg modern-empty">
        <div style="font-size:48px;opacity:0.18;">★</div>
        <div style="font-size:1.2em;margin:8px 0 2px 0;">No stocks in this watchlist</div>
        <div style="color:#888;font-size:0.98em;">Search and add stocks to get started!</div>
      </div>
    `;
    container.style.background =
      "linear-gradient(135deg,#f8fafc 60%,#e9f0fa 100%)";
    container.style.minHeight = "180px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    return;
  } else {
    container.style.background = "";
    container.style.minHeight = "";
    container.style.display = "";
    container.style.flexDirection = "";
    container.style.alignItems = "";
    container.style.justifyContent = "";
  }
  container.innerHTML = "";
  wl.symbols.forEach((item) => {
    // Support both string and object formats
    let symbol, price;
    if (typeof item === "string") {
      symbol = item;
      price = "-";
    } else if (typeof item === "object" && item !== null) {
      symbol = item.symbol || "-";
      price = item.price !== undefined ? item.price : "-";
    } else {
      symbol = "-";
      price = "-";
    }
    const card = document.createElement("div");
    card.className = "watchlist-card";
    card.innerHTML = `
      <div class="wl-symbol">${symbol}</div>
      <div class="wl-price">₹${price}</div>
      <button class="remove-wl-btn" data-symbol="${symbol}">Remove</button>
    `;
    container.appendChild(card);
  });
  // Attach remove handlers
  container.querySelectorAll(".remove-wl-btn").forEach((btn) => {
    btn.onclick = async (e) => {
      const symbol = btn.getAttribute("data-symbol");
      await removeFromWatchlist(symbol);
    };
  });
}

async function createWatchlist() {
  const name = prompt("Enter a name for your new watchlist:");
  if (!name) return;
  showLoader();
  try {
    const res = await fetch(apiBase + "/stocks/watchlists", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Failed to create watchlist", "error");
    } else {
      showToast("Watchlist created", "success");
      currentWatchlist = name;
      await fetchWatchlists();
    }
  } catch (e) {
    showToast("Network error", "error");
  }
  hideLoader();
}

async function addToWatchlist(symbol) {
  if (!currentWatchlist) return showToast("No watchlist selected", "error");
  showLoader();
  try {
    const res = await fetch(
      apiBase +
        `/stocks/watchlists/${encodeURIComponent(currentWatchlist)}/add`,
      {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ symbol }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Failed to add to watchlist", "error");
    } else {
      showToast("Added to watchlist", "success");
      await fetchWatchlists();
    }
  } catch (e) {
    showToast("Network error", "error");
  }
  hideLoader();
}

async function removeFromWatchlist(symbol) {
  if (!currentWatchlist) return showToast("No watchlist selected", "error");
  showLoader();
  try {
    const res = await fetch(
      apiBase +
        `/stocks/watchlists/${encodeURIComponent(currentWatchlist)}/remove`,
      {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ symbol }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Failed to remove from watchlist", "error");
    } else {
      showToast("Removed from watchlist", "success");
      await fetchWatchlists();
    }
  } catch (e) {
    showToast("Network error", "error");
  }
  hideLoader();
}
// --- Loader & Toast Utilities ---
function showLoader() {
  if (document.getElementById("global-loader")) return;
  const loader = document.createElement("div");
  loader.className = "loader-backdrop";
  loader.id = "global-loader";
  loader.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(loader);
}
function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.remove();
}

function showToast(message, type = "info", duration = 2500) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "toast show " + type;
  setTimeout(() => {
    toast.className = "toast " + type;
  }, duration);
}
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
  showLoader();
  cardsDiv.innerHTML = "";
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
        hideLoader();
        // Render card
        cardsDiv.innerHTML = `
          <div class="card" id="card-${searchSymbol}">
            <h2>${searchSymbol}</h2>
            <p>Current Price: <b>₹${data.price}</b></p>
            <button class="buy-btn">Buy</button>
            <button class="sell-btn">Sell</button>
            <button class="add-wl-btn" data-symbol="${searchSymbol}">Add to Watchlist</button>
          </div>
        `;
        // Attach buy/sell handlers
        document.querySelector(`#card-${searchSymbol} .buy-btn`).onclick = () =>
          buyStock(searchSymbol, data.price);
        document.querySelector(`#card-${searchSymbol} .sell-btn`).onclick =
          () => sellStock(searchSymbol, data.price);
        // Attach add to watchlist handler
        document.querySelector(`#card-${searchSymbol} .add-wl-btn`).onclick =
          () => addToWatchlist(searchSymbol);
        if (stockChart) stockChart.style.display = "block";
        return;
      } else {
        lastError = data.error || "Stock not found.";
      }
    } catch (err) {
      lastError = "Network error";
    }
  }
  hideLoader();
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
  const token = localStorage.getItem("token");
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
    showLoader();
    try {
      const res = await fetch(apiBase + "/stocks/buy", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ symbol, quantity: qty, price }),
      });
      const data = await res.json();
      hideLoader();
      if (!res.ok) {
        showToast(data.error || "Buy failed", "error");
        return showError(data.error || "Buy failed");
      }
      showToast("Buy successful!", "success");
      close();
      fetchPortfolio();
    } catch (e) {
      hideLoader();
      showToast("Network error", "error");
      showError("Network error");
    }
  });
}

async function sellStock(symbol, price) {
  showTradeModal("sell", symbol, price, async (qty, close, showError) => {
    showLoader();
    try {
      const res = await fetch(apiBase + "/stocks/sell", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ symbol, quantity: qty, price }),
      });
      const data = await res.json();
      hideLoader();
      if (!res.ok) {
        showToast(data.error || "Sell failed", "error");
        return showError(data.error || "Sell failed");
      }
      showToast("Sell successful!", "success");
      close();
      fetchPortfolio();
    } catch (e) {
      hideLoader();
      showToast("Network error", "error");
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
  // If no transactions, hide chart
  const chartDiv = document.getElementById("portfolioChartWrapper");
  if (!dataPoints.length) {
    if (chartDiv) chartDiv.style.display = "none";
    return;
  } else {
    if (chartDiv) chartDiv.style.display = "block";
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
    // Show only the part before @ if username looks like an email
    let displayName = data.username;
    if (displayName && displayName.includes("@")) {
      displayName = displayName.split("@")[0];
    }
    document.getElementById("username").textContent = displayName;
  } catch {
    document.getElementById("username").textContent = "User";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Dark Mode Toggle Logic ---
  const darkToggle = document.getElementById("darkToggle");
  // Load saved mode
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    if (darkToggle) darkToggle.checked = true;
  }
  if (darkToggle) {
    darkToggle.addEventListener("change", function () {
      if (darkToggle.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("darkMode", "true");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("darkMode", "false");
      }
    });
  }

  // --- Watchlist UI Events ---
  const select = document.getElementById("watchlist-select");
  const createBtn = document.getElementById("create-watchlist-btn");
  if (select) {
    select.onchange = function () {
      currentWatchlist = select.value;
      renderCurrentWatchlist();
    };
  }
  if (createBtn) {
    createBtn.onclick = function () {
      createWatchlist();
    };
  }
  fetchWatchlists();

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
