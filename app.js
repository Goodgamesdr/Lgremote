

const API = "http://localhost:3000";

function discoverTV() {
  fetch(`${API}/discover`)
    .then(res => res.json())
    .then(data => alert(`Found TV at ${data.ip}`))
    .catch(() => alert("No TV found"));
}

function pairTV() {
  const code = document.getElementById("pairCode").value;
  fetch(`${API}/pair`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("pairing").style.display = "none";
        document.getElementById("remote").style.display = "block";
      } else alert("Pairing failed");
    });
}

function send(command) {
  fetch(`${API}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command })
  });
}
