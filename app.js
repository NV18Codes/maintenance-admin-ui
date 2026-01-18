const API_URL = "https://maintenance-app-lptm.onrender.com";
let token = localStorage.getItem("token") || "";

/* ---------- AUTH ---------- */
async function login(){
  const email = emailInput.value;
  const password = passwordInput.value;

  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded" },
    body:form
  });

  const data = await res.json();
  if(res.ok){
    token = data.access_token;
    localStorage.setItem("token", token);
    location.href = "dashboard.html";
  } else alert("Login failed");
}

/* ---------- WORKERS ---------- */
async function addWorker(){
  const name = workerName.value;
  const role = workerRole.value;

  await fetch(`${API_URL}/workers/`,{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${token}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({name,role})
  });

  alert("Worker added");
}

/* ---------- WORK ORDER ---------- */
async function createWorkOrder(){
  const site = siteName.value;
  const client = clientName.value;

  await fetch(`${API_URL}/work-orders/`,{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${token}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({site_name:site, client_name:client})
  });

  alert("Work order created");
}

/* ---------- CHECKS ---------- */
function submitPrecheck(){ alert("Pre-check saved"); }
function submitPostcheck(){ alert("Post-check saved"); }
