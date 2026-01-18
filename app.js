const API_URL = "https://maintenance-app-lptm.onrender.com";

let token = localStorage.getItem("token") || "";

/* ---------------- LOGIN ---------------- */

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("username", email); // OAuth2 expects "username"
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

    document.getElementById("invoiceSection").style.display = "block";
    alert("Login successful");

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
}

/* ---------------- GENERATE INVOICE ---------------- */

async function generateInvoice() {
  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch(
      `${API_URL}/invoices/generate/1`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Invoice generation failed");
      return;
    }

    alert(`Invoice generated: ${data.invoice_number}`);

    // Open PDF if available
    if (data.pdf_url) {
      window.open(`${API_URL}${data.pdf_url}`, "_blank");
    }

  } catch (err) {
    console.error(err);
    alert("Failed to generate invoice");
  }
}

/* ---------------- PAGE LOAD ---------------- */

window.onload = () => {
  if (token) {
    document.getElementById("invoiceSection").style.display = "block";
  }
};
