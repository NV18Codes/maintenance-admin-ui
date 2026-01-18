const API_URL = "https://maintenance-app-lptm.onrender.com";

let token = "";

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = new URLSearchParams();
  formData.append("username", email);   // OAuth2 expects username
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  });

  const data = await res.json();

  if (data.access_token) {
    token = data.access_token;
    alert("Login successful");
  } else {
    alert("Login failed");
  }
}

// ---------------- GENERATE INVOICE ----------------
async function generateInvoice() {
  if (!token) {
    alert("Please login first");
    return;
  }

  const res = await fetch(`${API_URL}/invoices/generate/1`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (data.invoice_number) {
    alert(`Invoice generated: ${data.invoice_number}`);
    // Optional: window.open(`${API_URL}/${data.pdf_path}`);
  } else {
    alert("Invoice generation failed");
  }
}
