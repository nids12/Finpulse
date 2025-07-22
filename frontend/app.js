// --- Transaction History Logic ---
async function fetchAndShowAccountTransactions() {
  const table = document.getElementById("account-transactions-table");
  if (!table) return;
  table.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";
  try {
    const res = await fetch(apiBase + "/user/transactions", {
      headers: authHeader(),
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.transactions)) {
      if (data.transactions.length === 0) {
        table.innerHTML = `<tr><td colspan='3'><div class='modern-empty'><div style='font-size:48px'>💸</div><div style='font-size:1.2em'>No transactions yet</div><div style='color:#888'>Your deposits and withdrawals will appear here.</div></div></td></tr>`;
        return;
      }
      table.innerHTML = data.transactions
        .map((tx) => {
          const date = tx.date ? new Date(tx.date) : null;
          return `<tr>
          <td>${date ? date.toLocaleString() : "-"}</td>
          <td style="color:${
            tx.type === "deposit" ? "#1bc47d" : "#f44336"
          };font-weight:600">${
            tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
          }</td>
          <td>₹${tx.amount}</td>
        </tr>`;
        })
        .join("");
    } else {
      table.innerHTML = `<tr><td colspan='3'>Unable to load transactions</td></tr>`;
    }
  } catch {
    table.innerHTML = `<tr><td colspan='3'>Unable to load transactions</td></tr>`;
  }
}
// --- Account Balance Logic ---
async function fetchAndShowBalance() {
  const el = document.getElementById("balance-display");
  if (!el) return;
  try {
    const res = await fetch(apiBase + "/user/balance", {
      headers: authHeader(),
    });
    const data = await res.json();
    if (res.ok && typeof data.balance === "number") {
      el.textContent = `Balance: ₹${data.balance}`;
    } else {
      el.textContent = "Balance: --";
    }
  } catch {
    el.textContent = "Balance: --";
  }
}

function showAmountModal(type, onConfirm) {
  // Remove any existing modal
  const old = document.getElementById("amount-modal");
  if (old) old.remove();
  const modal = document.createElement("div");
  modal.id = "amount-modal";
  modal.innerHTML = `
    <div class="trade-modal-backdrop"></div>
    <div class="trade-modal-content amount-modal-centered">
      <h2>${type === "deposit" ? "Add Money" : "Withdraw Money"}</h2>
      <label>Amount: <input id="amount-input" type="number" min="1" style="width:100px;" /></label>
      <div class="trade-modal-actions">
        <button id="amount-confirm">${
          type === "deposit" ? "Add" : "Withdraw"
        }</button>
        <button id="amount-cancel">Cancel</button>
      </div>
      <div id="amount-error" style="color:#d32f2f;margin-top:8px;"></div>
    </div>
  `;
  document.body.appendChild(modal);
  // Modern glassmorphism style for modal (force all modal elements)
  const content = modal.querySelector(".amount-modal-centered");
  const isDark = document.body.classList.contains("dark");
  // Container
  content.style.setProperty("position", "fixed", "important");
  content.style.setProperty("top", "50%", "important");
  content.style.setProperty("left", "50%", "important");
  content.style.setProperty("transform", "translate(-50%, -50%)", "important");
  content.style.setProperty("z-index", "10001", "important");
  content.style.setProperty(
    "background",
    isDark
      ? "rgba(35,39,47,0.85)"
      : "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(207,222,243,0.85) 100%)",
    "important"
  );
  content.style.setProperty("color", isDark ? "#e3e3e3" : "#222", "important");
  content.style.setProperty("border-radius", "24px", "important");
  content.style.setProperty("padding", "2.5rem 2rem 2rem 2rem", "important");
  content.style.setProperty("max-width", "370px", "important");
  content.style.setProperty("min-width", "290px", "important");
  content.style.setProperty(
    "box-shadow",
    isDark ? "0 8px 32px 0 rgba(0,0,0,0.45)" : "0 8px 32px 0 rgba(0,0,0,0.18)",
    "important"
  );
  content.style.setProperty("margin", "0", "important");
  content.style.setProperty("text-align", "center", "important");
  content.style.setProperty("border", "none", "important");
  content.style.setProperty("backdrop-filter", "blur(18px)", "important");
  content.style.setProperty(
    "-webkit-backdrop-filter",
    "blur(18px)",
    "important"
  );
  content.style.setProperty(
    "animation",
    "modalPopIn 0.6s cubic-bezier(.23,1.01,.32,1)",
    "important"
  );
  content.style.setProperty(
    "transition",
    "box-shadow 0.3s, background 0.3s",
    "important"
  );
  // All children
  const h2 = content.querySelector("h2");
  if (h2) {
    h2.style.setProperty("color", isDark ? "#1bc47d" : "#007bff", "important");
    h2.style.setProperty("margin-bottom", "1.2em", "important");
    h2.style.setProperty("font-size", "1.7rem", "important");
    h2.style.setProperty("font-weight", "800", "important");
    h2.style.setProperty("letter-spacing", "0.02em", "important");
    h2.style.setProperty(
      "text-shadow",
      isDark ? "0 2px 8px #1bc47d44" : "0 2px 8px #007bff33",
      "important"
    );
  }
  const input = content.querySelector("input");
  if (input) {
    input.style.setProperty("margin-top", "1em", "important");
    input.style.setProperty("font-size", "1.15rem", "important");
    input.style.setProperty("border-radius", "12px", "important");
    input.style.setProperty(
      "border",
      isDark ? "1.5px solid #1bc47d" : "1.5px solid #007bff",
      "important"
    );
    input.style.setProperty(
      "background",
      isDark ? "#181c22cc" : "#f7fbffcc",
      "important"
    );
    input.style.setProperty("color", isDark ? "#e3e3e3" : "#222", "important");
    input.style.setProperty("padding", "0.7em 1.3em", "important");
    input.style.setProperty(
      "box-shadow",
      isDark ? "0 2px 8px #1bc47d22" : "0 2px 8px #007bff22",
      "important"
    );
    input.style.setProperty(
      "transition",
      "box-shadow 0.2s, border 0.2s",
      "important"
    );
    input.style.setProperty("appearance", "none", "important");
    input.style.setProperty("outline", "none", "important");
    input.style.setProperty("font-family", "inherit", "important");
    input.style.setProperty("box-sizing", "border-box", "important");
    input.onfocus = () => {
      input.style.setProperty(
        "box-shadow",
        isDark ? "0 0 0 2px #1bc47d" : "0 0 0 2px #007bff",
        "important"
      );
      input.style.setProperty(
        "border-color",
        isDark ? "#1bc47d" : "#007bff",
        "important"
      );
    };
    input.onblur = () => {
      input.style.setProperty(
        "box-shadow",
        isDark ? "0 2px 8px #1bc47d22" : "0 2px 8px #007bff22",
        "important"
      );
      input.style.setProperty(
        "border-color",
        isDark ? "#1bc47d" : "#007bff",
        "important"
      );
    };
  }
  const actions = content.querySelector(".trade-modal-actions");
  if (actions) {
    actions.style.setProperty("margin-top", "2em", "important");
    actions.style.setProperty("display", "flex", "important");
    actions.style.setProperty("justify-content", "center", "important");
    actions.style.setProperty("gap", "1.2em", "important");
  }
  const buttons = content.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.style.setProperty("appearance", "none", "important");
    btn.style.setProperty("outline", "none", "important");
    btn.style.setProperty("font-family", "inherit", "important");
    btn.style.setProperty("box-sizing", "border-box", "important");
    btn.style.setProperty(
      "background",
      btn.id === "amount-cancel"
        ? isDark
          ? "#23272f"
          : "#eee"
        : isDark
        ? "linear-gradient(90deg,#1bc47d 0%,#007bff 100%)"
        : "linear-gradient(90deg,#007bff 0%,#1bc47d 100%)",
      "important"
    );
    btn.style.setProperty(
      "color",
      btn.id === "amount-cancel" ? (isDark ? "#e3e3e3" : "#333") : "#fff",
      "important"
    );
    btn.style.setProperty("font-weight", "700", "important");
    btn.style.setProperty("border-radius", "12px", "important");
    btn.style.setProperty("border", "none", "important");
    btn.style.setProperty("padding", "0.7em 1.5em", "important");
    btn.style.setProperty("font-size", "1.15rem", "important");
    btn.style.setProperty(
      "box-shadow",
      btn.id === "amount-cancel"
        ? isDark
          ? "0 2px 8px #23272f44"
          : "0 2px 8px #eee44"
        : isDark
        ? "0 2px 8px #1bc47d44"
        : "0 2px 8px #007bff44",
      "important"
    );
    btn.style.setProperty("cursor", "pointer", "important");
    btn.style.setProperty(
      "transition",
      "background 0.2s, box-shadow 0.2s",
      "important"
    );
    btn.onmouseover = () => {
      btn.style.setProperty(
        "background",
        btn.id === "amount-cancel"
          ? isDark
            ? "#333"
            : "#ccc"
          : isDark
          ? "#007bff"
          : "#1bc47d",
        "important"
      );
      btn.style.setProperty(
        "color",
        btn.id === "amount-cancel" ? (isDark ? "#e3e3e3" : "#333") : "#fff",
        "important"
      );
      btn.style.setProperty("box-shadow", "0 4px 16px #0002", "important");
    };
    btn.onmouseout = () => {
      btn.style.setProperty(
        "background",
        btn.id === "amount-cancel"
          ? isDark
            ? "#23272f"
            : "#eee"
          : isDark
          ? "linear-gradient(90deg,#1bc47d 0%,#007bff 100%)"
          : "linear-gradient(90deg,#007bff 0%,#1bc47d 100%)",
        "important"
      );
      btn.style.setProperty(
        "color",
        btn.id === "amount-cancel" ? (isDark ? "#e3e3e3" : "#333") : "#fff",
        "important"
      );
      btn.style.setProperty(
        "box-shadow",
        btn.id === "amount-cancel"
          ? isDark
            ? "0 2px 8px #23272f44"
            : "0 2px 8px #eee44"
          : isDark
          ? "0 2px 8px #1bc47d44"
          : "0 2px 8px #007bff44",
        "important"
      );
    };
  });
  // Also force label style
  const label = content.querySelector("label");
  if (label) {
    label.style.setProperty("font-size", "1.1rem", "important");
    label.style.setProperty("font-weight", "600", "important");
    label.style.setProperty("margin-bottom", "1em", "important");
    label.style.setProperty("display", "block", "important");
    label.style.setProperty("color", isDark ? "#e3e3e3" : "#222", "important");
  }
  // Add keyframes for pop-in animation
  if (!document.getElementById("modal-popin-style")) {
    const style = document.createElement("style");
    style.id = "modal-popin-style";
    style.textContent = `@keyframes modalPopIn {0%{opacity:0;transform:translate(-50%,-60%) scale(0.95);}100%{opacity:1;transform:translate(-50%,-50%) scale(1);}}`;
    document.head.appendChild(style);
  }
  // Remove duplicate non-important style assignments for modal elements
  modal.querySelector(".trade-modal-backdrop").style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0004;z-index:10000;";
  modal.querySelector("#amount-cancel").onclick = () => modal.remove();
  modal.querySelector(".trade-modal-backdrop").onclick = () => modal.remove();
  modal.querySelector("#amount-confirm").onclick = () => {
    const amt = parseFloat(modal.querySelector("#amount-input").value);
    console.log("Amount modal confirm clicked", { amt, type });
    if (!amt || amt <= 0) {
      modal.querySelector("#amount-error").textContent =
        "Enter a valid amount.";
      return;
    }
    // Use stable close and error callbacks
    const close = () => {
      console.log("Modal close called");
      modal.remove();
    };
    const showError = (err) => {
      console.log("Modal showError called", err);
      modal.querySelector("#amount-error").textContent =
        err || "Operation failed.";
    };
    onConfirm(amt, close, showError);
  };
}

async function depositMoney(amount, onSuccess, onError) {
  try {
    console.log("depositMoney called", amount);
    showLoader();
    const res = await fetch(apiBase + "/user/deposit", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ amount }),
    });
    hideLoader();
    const data = await res.json();
    console.log("depositMoney response", res.status, data);
    if (res.ok) {
      showToast("Money added!", "success");
      showConfetti();
      fetchAndShowBalance();
      if (onSuccess) onSuccess();
    } else {
      showToast(data.error || "Deposit failed", "error");
      if (onError) onError(data.error);
    }
  } catch (e) {
    hideLoader();
    showToast("Deposit failed", "error");
    if (onError) onError("Deposit failed");
    console.error("depositMoney error", e);
  }
}

async function withdrawMoney(amount, onSuccess, onError) {
  try {
    console.log("withdrawMoney called", amount);
    showLoader();
    const res = await fetch(apiBase + "/user/withdraw", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ amount }),
    });
    hideLoader();
    const data = await res.json();
    console.log("withdrawMoney response", res.status, data);
    if (res.ok) {
      showToast("Money withdrawn!", "success");
      showConfetti();
      fetchAndShowBalance();
      if (onSuccess) onSuccess();
    } else {
      showToast(data.error || "Withdraw failed", "error");
      if (onError) onError(data.error);
    }
  } catch (e) {
    hideLoader();
    showToast("Withdraw failed", "error");
    if (onError) onError("Withdraw failed");
    console.error("withdrawMoney error", e);
  }
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

// --- Confetti Celebration ---
function showConfetti() {
  // If confetti already exists, remove it first
  const old = document.getElementById("confetti-canvas");
  if (old) old.remove();
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "2147483647";
  canvas.style.display = "block";
  canvas.style.opacity = "1";
  canvas.style.mixBlendMode = "normal";
  document.body.appendChild(canvas);
  // Force repaint for some browsers
  canvas.offsetHeight;
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const ctx = canvas.getContext("2d");
  // Confetti parameters
  const confettiCount = 120;
  const confetti = [];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 6 + Math.random() * 8,
      d: Math.random() * 2 + 2,
      color: `hsl(${Math.random() * 360},80%,60%)`,
      tilt: Math.random() * 10,
      tiltAngle: Math.random() * Math.PI,
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.r, c.r / 2, c.tiltAngle, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
  }
  function update() {
    confetti.forEach((c) => {
      c.y += c.d + Math.sin(frame / 10 + c.tilt) * 2;
      c.x += Math.sin(frame / 20 + c.tilt) * 2;
      c.tiltAngle += 0.08;
      if (c.y > canvas.height + 20) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }
    });
    frame++;
  }
  let duration = 0;
  function loop() {
    draw();
    update();
    duration++;
    if (duration < 90) {
      requestAnimationFrame(loop);
    } else {
      window.removeEventListener("resize", resizeCanvas);
      canvas.remove();
    }
  }
  loop();
}

// Attach balance/deposit/withdraw UI events
document.addEventListener("DOMContentLoaded", () => {
  fetchAndShowBalance();
  fetchAndShowAccountTransactions();
  const depositBtn = document.getElementById("deposit-btn");
  if (depositBtn) {
    depositBtn.onclick = () => {
      console.log("[DEBUG] Deposit button clicked");
      showAmountModal("deposit", (amt, close, err) => {
        console.log("[DEBUG] Deposit modal confirm", amt);
        depositMoney(
          amt,
          () => {
            console.log("[DEBUG] Deposit success, closing modal");
            close();
            fetchAndShowAccountTransactions();
          },
          err
        );
      });
    };
  }
  const withdrawBtn = document.getElementById("withdraw-btn");
  if (withdrawBtn) {
    withdrawBtn.onclick = () => {
      console.log("[DEBUG] Withdraw button clicked");
      showAmountModal("withdraw", (amt, close, err) => {
        console.log("[DEBUG] Withdraw modal confirm", amt);
        withdrawMoney(
          amt,
          () => {
            console.log("[DEBUG] Withdraw success, closing modal");
            close();
            fetchAndShowAccountTransactions();
          },
          err
        );
      });
    };
  }
});
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

// --- Confetti Celebration ---
function showConfetti() {
  // If confetti already exists, remove it first
  const old = document.getElementById("confetti-canvas");
  if (old) old.remove();
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "100000";
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  // Confetti parameters
  const confettiCount = 120;
  const confetti = [];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 6 + Math.random() * 8,
      d: Math.random() * 2 + 2,
      color: `hsl(${Math.random() * 360},80%,60%)`,
      tilt: Math.random() * 10,
      tiltAngle: Math.random() * Math.PI,
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.r, c.r / 2, c.tiltAngle, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
  }
  function update() {
    confetti.forEach((c) => {
      c.y += c.d + Math.sin(frame / 10 + c.tilt) * 2;
      c.x += Math.sin(frame / 20 + c.tilt) * 2;
      c.tiltAngle += 0.08;
      if (c.y > canvas.height + 20) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }
    });
    frame++;
  }
  let duration = 0;
  function loop() {
    draw();
    update();
    duration++;
    if (duration < 90) {
      requestAnimationFrame(loop);
    } else {
      canvas.remove();
    }
  }
  loop();
}

// --- FinPulse Dashboard JS: Buy/Sell/Portfolio ---

// --- Search Logic ---
// --- Groww-style Search Dropdown ---
let dropdownDiv = null;
async function showSearchDropdown(prefix) {
  if (!prefix || prefix.length < 1) {
    if (dropdownDiv) dropdownDiv.remove();
    return;
  }
  const input = document.getElementById("symbolInput");
  if (!input) return;
  const container = input.closest(".search-bar-container");
  if (!container) return;
  container.style.position = "relative";
  const res = await fetch(`${apiBase}/stocks/all`);
  const stocks = await res.json();
  let matches = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(prefix.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(prefix.toLowerCase()))
  );
  // If exact match, move it to top
  const exact = stocks.find(
    (s) => s.symbol.toLowerCase() === prefix.toLowerCase()
  );
  if (exact) {
    matches = [exact, ...matches.filter((s) => s.symbol !== exact.symbol)];
  }
  if (dropdownDiv) dropdownDiv.remove();
  dropdownDiv = document.createElement("div");
  dropdownDiv.className = "stock-search-dropdown";
  dropdownDiv.style.position = "absolute";
  dropdownDiv.style.left = 0;
  dropdownDiv.style.top = input.offsetTop + input.offsetHeight + "px";
  dropdownDiv.style.width = input.offsetWidth + "px";
  dropdownDiv.style.zIndex = 1000;

  // Recent Searches
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem("recentStocks") || "[]");
  } catch {}
  if (recent.length > 0) {
    const recentDiv = document.createElement("div");
    recentDiv.className = "stock-search-recent";
    recentDiv.innerHTML = `<div style='padding:8px 24px;font-weight:600;color:#007bff;'>Recent Searches</div>`;
    recent.forEach((stock) => {
      const item = document.createElement("div");
      item.className = "stock-search-item";
      item.innerHTML = `
        <span class=\"stock-symbol\">${stock.symbol}</span>
        <span class=\"stock-name\">${stock.name}</span>
        <span class=\"stock-price\">₹${stock.current || stock.price}</span>
      `;
      item.onclick = () => {
        input.value = stock.symbol;
        if (dropdownDiv) dropdownDiv.remove();
        searchAndDisplayStock(stock.symbol);
      };
      recentDiv.appendChild(item);
    });
    dropdownDiv.appendChild(recentDiv);
    // Divider
    const divider = document.createElement("div");
    divider.style.cssText = "height:1px;background:#eee;margin:4px 0;";
    dropdownDiv.appendChild(divider);
  }

  if (matches.length === 0) {
    dropdownDiv.innerHTML += `<div class='no-match'>No stocks found</div>`;
  } else {
    matches.forEach((stock) => {
      const item = document.createElement("div");
      item.className = "stock-search-item";
      // Highlight match in symbol and name
      const re = new RegExp(`(${prefix})`, "ig");
      const symbolHtml = stock.symbol.replace(re, "<mark>$1</mark>");
      const nameHtml = stock.name.replace(re, "<mark>$1</mark>");
      item.innerHTML = `
        <span class=\"stock-symbol\">${symbolHtml}</span>
        <span class=\"stock-name\">${nameHtml}</span>
        <span class=\"stock-price\">₹${stock.current || stock.price}</span>
      `;
      item.onclick = () => {
        input.value = stock.symbol;
        if (dropdownDiv) dropdownDiv.remove();
        // Add to recent searches
        let recent = [];
        try {
          recent = JSON.parse(localStorage.getItem("recentStocks") || "[]");
        } catch {}
        // Remove if already present
        recent = recent.filter((s) => s.symbol !== stock.symbol);
        recent.unshift(stock);
        if (recent.length > 5) recent = recent.slice(0, 5);
        localStorage.setItem("recentStocks", JSON.stringify(recent));
        // Always show card for selected stock only
        searchAndDisplayStock(stock.symbol);
      };
      dropdownDiv.appendChild(item);
    });
  }
  container.appendChild(dropdownDiv);
}

// Patch search event to show dropdown
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("symbolInput");
  if (input) {
    input.addEventListener("input", (e) => {
      showSearchDropdown(input.value.trim());
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (dropdownDiv) dropdownDiv.remove();
        searchAndDisplayStock(input.value.trim());
      }
    });
    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (dropdownDiv) dropdownDiv.remove();
      }, 200);
    });
  }
});

// --- Card rendering remains unchanged ---
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
  let lastError = null;
  try {
    const res = await fetch(`${apiBase}/stocks/all`);
    const stocks = await res.json();
    if (!res.ok || !Array.isArray(stocks)) throw new Error("API error");
    const prefix = symbol.trim().toUpperCase();
    let matches = stocks.filter(
      (s) =>
        (s.symbol && s.symbol.toUpperCase().includes(prefix)) ||
        (s.name && s.name.toUpperCase().includes(prefix))
    );
    // If exact match, move it to top
    const exact = stocks.find(
      (s) => s.symbol && s.symbol.toUpperCase() === prefix
    );
    if (exact) {
      matches = [exact, ...matches.filter((s) => s.symbol !== exact.symbol)];
    }
    if (matches.length === 0) {
      hideLoader();
      cardsDiv.innerHTML = `<div class='error-msg'>No stocks found for: ${symbol}</div>`;
      cardsDiv.style.minHeight = "0";
      cardsDiv.style.padding = "0";
      cardsDiv.style.background = "none";
      if (stockChart) stockChart.style.display = "none";
      return;
    }
    cardsDiv.innerHTML = matches
      .map(
        (stock) => `
      <div class="card" id="card-${
        stock.symbol
      }" style="display:flex;align-items:center;gap:1em;padding:1em 0;border-bottom:1px solid #eee;">
        <div style="flex:1;">
          <div style="font-size:1.1em;font-weight:600;">${
            stock.name || stock.symbol
          }</div>
          <div style="color:#888;font-size:0.98em;">Stock • <b>${
            stock.symbol
          }</b></div>
          <div style="color:#444;font-size:0.98em;">Current Price: <b>₹${
            stock.price || stock.current
          }</b></div>
        </div>
        <div style="display:flex;gap:0.5em;">
          <button class="buy-btn">Buy</button>
          <button class="sell-btn">Sell</button>
        </div>
      </div>
    `
      )
      .join("");
    matches.forEach((stock) => {
      document.querySelector(`#card-${stock.symbol} .buy-btn`).onclick = () =>
        buyStock(stock.symbol, stock.price || stock.current);
      document.querySelector(`#card-${stock.symbol} .sell-btn`).onclick = () =>
        sellStock(stock.symbol, stock.price || stock.current);
    });
    hideLoader();
    if (stockChart) stockChart.style.display = "block";
  } catch (err) {
    hideLoader();
    cardsDiv.innerHTML = `<div class='error-msg'>Error loading stocks</div>`;
    cardsDiv.style.minHeight = "0";
    cardsDiv.style.padding = "0";
    cardsDiv.style.background = "none";
    if (stockChart) stockChart.style.display = "none";
  }
}
// --- CSS for Groww-style stock search dropdown ---
if (!document.getElementById("stock-search-style")) {
  const style = document.createElement("style");
  style.id = "stock-search-style";
  style.innerHTML = `
    .stock-search-dropdown {
      position: absolute;
      top: 48px;
      left: 0;
      right: 0;
      max-height: 320px;
      overflow-y: auto;
      background: rgba(255,255,255,0.25);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 100;
      padding: 8px 0;
    }
    .stock-search-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 24px;
      cursor: pointer;
      transition: background 0.15s;
      border-bottom: 1px solid rgba(0,0,0,0.04);
    }
    .stock-search-item:last-child {
      border-bottom: none;
    }
    .stock-search-item:hover {
      background: rgba(0, 153, 102, 0.08);
    }
    .stock-symbol {
      font-weight: bold;
      font-size: 1.1em;
      color: #222;
    }
    .stock-name {
      color: #555;
      font-size: 1em;
    }
    .stock-price {
      color: #009966;
      font-size: 1em;
      margin-left: auto;
    }
    .no-match {
      color: #999;
      padding: 16px;
      text-align: center;
    }
  `;
  document.head.appendChild(style);
}

// Attach search event
// (Removed duplicate search event handler. Only Groww-style dropdown logic is used above.)
// const apiBase = "http://localhost:5000/api"; // Duplicate declaration removed

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
    <div class="trade-modal-content amount-modal-centered" id="trade-modal-content">
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
  // Modern glassmorphism style for trade modal (force all modal elements)
  // (Already applied below, so do not overwrite with Object.assign)
  const content = modal.querySelector(".trade-modal-content");
  const isDark = document.body.classList.contains("dark");
  // Container and children styles are set below (with !important)
  modal.querySelector(".trade-modal-backdrop").style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0004;z-index:10000;";
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
      showConfetti();
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
      showConfetti();
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
    tbody.innerHTML += `<tr>
      <td>${h.symbol}</td>
      <td>${h.quantity}</td>
      <td>${h.avgPrice.toFixed(2)}</td>
      <td>
        <button class="sell-btn" style="padding:6px 16px;font-size:1em;border-radius:8px;cursor:pointer;" data-symbol="${
          h.symbol
        }" data-price="${h.avgPrice}">Sell</button>
      </td>
    </tr>`;
  });
  // Attach sell button handlers
  Array.from(tbody.querySelectorAll(".sell-btn")).forEach((btn) => {
    btn.onclick = () => {
      const symbol = btn.getAttribute("data-symbol");
      const price = parseFloat(btn.getAttribute("data-price"));
      sellStock(symbol, price);
    };
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
// let portfolioValueChart; // Duplicate declaration removed

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
    <div class="trade-modal-content amount-modal-centered">
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
  // Modern glassmorphism style for trade modal (force all modal elements)
  const content = modal.querySelector(".trade-modal-content");
  const isDark = document.body.classList.contains("dark");
  // Container
  content.style.setProperty("position", "fixed", "important");
  content.style.setProperty("top", "50%", "important");
  content.style.setProperty("left", "50%", "important");
  content.style.setProperty("transform", "translate(-50%, -50%)", "important");
  content.style.setProperty("z-index", "10001", "important");
  content.style.setProperty(
    "background",
    isDark
      ? "rgba(35,39,47,0.85)"
      : "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(207,222,243,0.85) 100%)",
    "important"
  );
  content.style.setProperty("color", isDark ? "#e3e3e3" : "#222", "important");
  content.style.setProperty("border-radius", "24px", "important");
  content.style.setProperty("padding", "2.5rem 2rem 2rem 2rem", "important");
  content.style.setProperty("max-width", "370px", "important");
  content.style.setProperty("min-width", "290px", "important");
  content.style.setProperty(
    "box-shadow",
    isDark ? "0 8px 32px 0 rgba(0,0,0,0.45)" : "0 8px 32px 0 rgba(0,0,0,0.18)",
    "important"
  );
  content.style.setProperty("margin", "0", "important");
  content.style.setProperty("text-align", "center", "important");
  content.style.setProperty("border", "none", "important");
  content.style.setProperty("backdrop-filter", "blur(18px)", "important");
  content.style.setProperty(
    "-webkit-backdrop-filter",
    "blur(18px)",
    "important"
  );
  content.style.setProperty(
    "animation",
    "modalPopIn 0.6s cubic-bezier(.23,1.01,.32,1)",
    "important"
  );
  content.style.setProperty(
    "transition",
    "box-shadow 0.3s, background 0.3s",
    "important"
  );
  // All children
  const h2 = content.querySelector("h2");
  if (h2) {
    h2.style.setProperty("color", isDark ? "#1bc47d" : "#007bff", "important");
    h2.style.setProperty("margin-bottom", "1.2em", "important");
    h2.style.setProperty("font-size", "1.7rem", "important");
    h2.style.setProperty("font-weight", "800", "important");
    h2.style.setProperty("letter-spacing", "0.02em", "important");
    h2.style.setProperty(
      "text-shadow",
      isDark ? "0 2px 8px #1bc47d44" : "0 2px 8px #007bff33",
      "important"
    );
  }
  const input = content.querySelector("input");
  if (input) {
    input.style.setProperty("margin-top", "1em", "important");
    input.style.setProperty("font-size", "1.15rem", "important");
    input.style.setProperty("border-radius", "12px", "important");
    input.style.setProperty(
      "border",
      isDark ? "1.5px solid #1bc47d" : "1.5px solid #007bff",
      "important"
    );
    input.style.setProperty(
      "background",
      isDark ? "#181c22cc" : "#f7fbffcc",
      "important"
    );
    input.style.setProperty("color", isDark ? "#e3e3e3" : "#222", "important");
    input.style.setProperty("padding", "0.7em 1.3em", "important");
    input.style.setProperty(
      "box-shadow",
      isDark ? "0 2px 8px #1bc47d22" : "0 2px 8px #007bff22",
      "important"
    );
    input.style.setProperty(
      "transition",
      "box-shadow 0.2s, border 0.2s",
      "important"
    );
    input.style.setProperty("appearance", "none", "important");
    input.style.setProperty("outline", "none", "important");
    input.style.setProperty("font-family", "inherit", "important");
    input.style.setProperty("box-sizing", "border-box", "important");
    input.onfocus = () => {
      input.style.setProperty(
        "box-shadow",
        isDark ? "0 0 0 2px #1bc47d" : "0 0 0 2px #007bff",
        "important"
      );
      input.style.setProperty(
        "border-color",
        isDark ? "#1bc47d" : "#007bff",
        "important"
      );
    };
    input.onblur = () => {
      input.style.setProperty(
        "box-shadow",
        isDark ? "0 2px 8px #1bc47d22" : "0 2px 8px #007bff22",
        "important"
      );
      input.style.setProperty(
        "border-color",
        isDark ? "#1bc47d" : "#007bff",
        "important"
      );
    };
  }
  const actions = content.querySelector(".trade-modal-actions");
  if (actions) {
    actions.style.setProperty("margin-top", "2em", "important");
    actions.style.setProperty("display", "flex", "important");
    actions.style.setProperty("justify-content", "center", "important");
    actions.style.setProperty("gap", "1.2em", "important");
  }
  const buttons = content.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.style.setProperty("appearance", "none", "important");
    btn.style.setProperty("outline", "none", "important");
    btn.style.setProperty("font-family", "inherit", "important");
    btn.style.setProperty("box-sizing", "border-box", "important");
    btn.style.setProperty(
      "background",
      btn.id === "trade-cancel"
        ? isDark
          ? "#23272f"
          : "#eee"
        : isDark
        ? "linear-gradient(90deg,#1bc47d 0%,#007bff 100%)"
        : "linear-gradient(90deg,#007bff 0%,#1bc47d 100%)",
      "important"
    );
    btn.style.setProperty(
      "color",
      btn.id === "trade-cancel" ? (isDark ? "#e3e3e3" : "#333") : "#fff",
      "important"
    );
    btn.style.setProperty("font-weight", "700", "important");
    btn.style.setProperty("border-radius", "12px", "important");
    btn.style.setProperty("border", "none", "important");
    btn.style.setProperty("padding", "0.7em 1.5em", "important");
    btn.style.setProperty("font-size", "1.15rem", "important");
    btn.style.setProperty(
      "box-shadow",
      btn.id === "trade-cancel"
        ? isDark
          ? "0 2px 8px #23272f44"
          : "0 2px 8px #eee44"
        : isDark
        ? "0 2px 8px #1bc47d44"
        : "0 2px 8px #007bff44",
      "important"
    );
    btn.style.setProperty("cursor", "pointer", "important");
    btn.style.setProperty(
      "transition",
      "background 0.2s, box-shadow 0.2s",
      "important"
    );
    btn.onmouseover = () => {
      btn.style.setProperty(
        "background",
        btn.id === "trade-cancel"
          ? isDark
            ? "#333"
            : "#ccc"
          : isDark
          ? "#007bff"
          : "#1bc47d",
        "important"
      );
      btn.style.setProperty(
        "color",
        btn.id === "trade-cancel" ? (isDark ? "#e3e3e3" : "#333") : "#fff",
        "important"
      );
      btn.style.setProperty("box-shadow", "0 4px 16px #0002", "important");
    };
    btn.onmouseout = () => {
      btn.style.setProperty(
        "background",
        btn.id === "trade-cancel"
          ? isDark
            ? "#23272f"
            : "#eee"
          : isDark
          ? "linear-gradient(90deg,#1bc47d 0%,#007bff 100%)"
          : "linear-gradient(90deg,#007bff 0%,#1bc47d 100%)",
        "important"
      );
      btn.style.setProperty(
        "color",
        btn.id === "trade-cancel" ? (isDark ? "#e3e3e3" : "#333") : "#fff",
        "important"
      );
      btn.style.setProperty(
        "box-shadow",
        btn.id === "trade-cancel"
          ? isDark
            ? "0 2px 8px #23272f44"
            : "0 2px 8px #eee44"
          : isDark
          ? "0 2px 8px #1bc47d44"
          : "0 2px 8px #007bff44",
        "important"
      );
    };
  });
  // Also force label style
  const label = content.querySelector("label");
  if (label) {
    label.style.setProperty("font-size", "1.1rem", "important");
    label.style.setProperty("font-weight", "600", "important");
    label.style.setProperty("margin-bottom", "1em", "important");
    label.style.setProperty("display", "block", "important");
    label.style.setProperty("color", isDark ? "#e3e3e3" : "#222", "important");
  }
  // Add keyframes for pop-in animation
  if (!document.getElementById("modal-popin-style")) {
    const style = document.createElement("style");
    style.id = "modal-popin-style";
    style.textContent = `@keyframes modalPopIn {0%{opacity:0;transform:translate(-50%,-60%) scale(0.95);}100%{opacity:1;transform:translate(-50%,-50%) scale(1);}}`;
    document.head.appendChild(style);
  }
  // Remove duplicate non-important style assignments for modal elements
  modal.querySelector(".trade-modal-backdrop").style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0004;z-index:10000;";
  modal.querySelector("#trade-cancel").onclick = () => modal.remove();
  modal.querySelector(".trade-modal-backdrop").onclick = () => modal.remove();
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
