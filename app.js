const API_URL = "https://maintenance-app-lptm.onrender.com";

let token = "";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = new URLSearchParams();
  formData.append("username", email);   // OAuth2 expects "username"
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData.toString()
  });

  const data = await res.json();

  if (data.access_token) {
    token = data.access_token;
    localStorage.setItem("token", token);
    document.getElementById("invoiceSection").style.display = "block";
    alert("Login successful");
  } else {
    alert("Login failed");
  }
}


async function generateInvoice() {
  if (!token) {
    alert("Please login first");
    return;
  }

  const workOrderId = document.getElementById("workOrderId").value;

  const res = await fetch(
    `${API_URL}/invoices/generate/1`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  

  const data = await res.json();

  if (data.invoice_number) {
    const link = document.getElementById("invoiceLink");
    link.href = `${API_URL}${data.pdf_url}`;
    link.innerText = `Download Invoice ${data.invoice_number}`;
    link.style.display = "block";
  } else {
    alert("Invoice generation failed");
  }
}


window.onload = () => {
  if (localStorage.getItem("token")) {
    document.getElementById("invoiceSection").style.display = "block";
  }
};
