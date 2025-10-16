// ======== MONBAILZEN v7 - JS INTERACTIF ========
// Gestion des onglets de navigation
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tabId = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");
    document.getElementById(tabId)?.style?.setProperty("display", "block");
  });
});

// Activation du bouton "Essayer la démo"
document.getElementById("open-app")?.addEventListener("click", () => {
  window.open("https://mon-bail-zen.vercel.app/demo", "_blank");
});

// Animation légère au clic
document.querySelectorAll("button, .btn, .tab").forEach(el => {
  el.addEventListener("click", () => {
    el.classList.add("pulse");
    setTimeout(() => el.classList.remove("pulse"), 300);
  });
});

// ======== GESTION DU FORMULAIRE BAIL SIMPLE ========
function updateForm() {
  const locataire = document.getElementById("locataire").value;
  const logement = document.getElementById("logement").value;
  document.getElementById("resume").innerText = 
    `📄 Bail entre ${locataire || "___"} et le bien ${logement || "___"}`;
}
document.querySelectorAll("#locataire, #logement").forEach(el => {
  el?.addEventListener("input", updateForm);
});

// ======== FONCTIONS DEMO ========
console.log("MonBailZen v7 : Script chargé ✅");

// ======== PETITE ANIMATION D’APPARITION ========
window.addEventListener("load", () => {
  document.body.style.opacity = "1";
  document.body.style.transition = "opacity 0.6s ease-in";
});
