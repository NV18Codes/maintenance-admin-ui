/* ================= CONFIG ================= */

const API_URL = "https://maintenance-app-lptm.onrender.com";
let token = localStorage.getItem("token") || "";

/* ================= AUTH GUARD ================= */

function requireLogin() {
  if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "index.html";
  }
}

/* ================= LOGIN ================= */

async function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("username", email);   // OAuth2 field
  formData.append("password", password);

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    token = data.access_token;
    localStorage.setItem("token", token);

    const invoiceSection = document.getElementById("invoiceSection");
    if (invoiceSection) invoiceSection.style.display = "block";

    alert("Login successful");
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
}

function getUserRole() {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

/* ================= LOGOUT ================= */

function logout() {
  localStorage.removeItem("token");
  token = "";
  window.location.href = "index.html";
}

/* ================= HEADER HELPER ================= */

function authHeaders(extra = {}) {
  return {
    "Authorization": `Bearer ${token}`,
    ...extra
  };
}

/* ================= GENERATE INVOICE ================= */

async function generateInvoice() {
  requireLogin();

  const workOrderId =
    document.getElementById("workOrderId")?.value || 1;

  try {
    const res = await fetch(
      `${API_URL}/invoices/generate/${workOrderId}`,
      {
        method: "POST",
        headers: authHeaders()
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Invoice generation failed");
      return;
    }

    alert(`Invoice generated: ${data.invoice_number}`);

    if (data.pdf_url) {
      window.open(`${API_URL}${data.pdf_url}`, "_blank");
    }

  } catch (err) {
    console.error(err);
    alert("Failed to generate invoice");
  }
}

/* ================= PRE-CHECK ================= */

async function submitPrecheck() {
  requireLogin();

  const payload = {
    tools_ok: document.getElementById("tools")?.checked || false,
    safety_ok: document.getElementById("safety")?.checked || false,
    workers_ok: document.getElementById("workers")?.checked || false,
    site_ok: document.getElementById("site")?.checked || false,
    remarks: document.getElementById("remarks")?.value || "",
    work_order_id:
      document.getElementById("workOrderId")?.value || 1
  };

  try {
    const res = await fetch(`${API_URL}/pre-check/`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Pre-check failed");
      return;
    }

    alert("Pre-check submitted successfully");

  } catch (err) {
    console.error(err);
    alert("Server error while submitting pre-check");
  }
}

/* ================= POST-CHECK (IMAGES) ================= */

async function submitPostcheck() {
  requireLogin();

  const formData = new FormData();
  formData.append(
    "work_order_id",
    document.getElementById("workOrderId")?.value || 1
  );
  formData.append(
    "remarks",
    document.getElementById("remarks")?.value || ""
  );

  const images = document.getElementById("images")?.files || [];
  for (let img of images) {
    formData.append("images", img);
  }

  try {
    const res = await fetch(`${API_URL}/post-check/`, {
      method: "POST",
      headers: authHeaders(),
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Post-check failed");
      return;
    }

    alert("Post-check completed successfully");

  } catch (err) {
    console.error(err);
    alert("Post-check upload failed");
  }
}

/* ================= ATTENDANCE ================= */

async function submitAttendance() {
  requireLogin();

  const payload = {
    worker_name: document.getElementById("workerName")?.value,
    status: document.getElementById("status")?.value,
    work_order_id:
      document.getElementById("workOrderId")?.value || 1
  };

  try {
    const res = await fetch(`${API_URL}/attendance/`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Attendance failed");
      return;
    }

    alert("Attendance recorded successfully");

  } catch (err) {
    console.error(err);
    alert("Attendance submission failed");
  }
}

/* ================= PAGE LOAD ================= */

window.onload = () => {
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const role = getUserRole();

  const adminSection = document.getElementById("adminSection");
  const workerSection = document.getElementById("workerSection");

  if (role === "admin") {
    if (adminSection) adminSection.style.display = "block";
    if (workerSection) workerSection.style.display = "none";
  } else {
    if (adminSection) adminSection.style.display = "none";
    if (workerSection) workerSection.style.display = "block";
  }
};

