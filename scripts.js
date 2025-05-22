// === DATOS ===
const students = [
  "Ana Gómez","Luis Pérez","María Rodríguez","Carlos Sánchez","Lucía Fernández",
  "Diego Martínez","Laura López","Jorge Díaz","Gabriela Torres","Daniel Ruiz",
  "Sofía Ramírez","Andrés Vargas","Valentina Castro","Ricardo Morales","Fernanda Herrera",
  "Pablo Ortiz","Camila Rojas","Miguel Flores","Elena Jiménez","Felipe Mendoza",
  "Isabela Navarro","Javier Cruz","Mariana Silva","Bruno Vidal","Juliana Pereira",
  "Esteban Campos","Alma Delgado","Sebastián León","Paula Herrera","Tomás Aguirre"
];

const workshops = [
  { name: "Yoga",     professor: "Sofía Martínez",    price: 18000, enrolled: [] },
  { name: "Teatro",   professor: "Diego Fernández",   price: 20000, enrolled: [] },
  { name: "Acrotela", professor: "Lucía Ramírez",     price: 22000, enrolled: [] }
];

const studentProfiles = students.map(name => ({
  name,
  paid: [],
  owed: []
}));

// Inicializar datos aleatorios
(function initData(){
  workshops.forEach(w => {
    const count = Math.floor(Math.random()*9) + 8;
    const shuffled = [...studentProfiles].sort(() => Math.random() - 0.5);
    w.enrolled = shuffled.slice(0, count);
    w.enrolled.forEach(st => {
      if (Math.random() < 0.6) st.paid.push(w.name);
      else st.owed.push(w.name);
    });
  });
})();

// === RENDER ===
function populateStudents() {
  const c = document.getElementById("studentsList");
  c.innerHTML = "";
  studentProfiles.forEach(st => {
    const card = document.createElement("div");
    card.className = "card";
    const status = st.owed.length
      ? `<small class="owed">Adeuda ${st.owed.length}</small>`
      : `<small class="paid">Pagó todo</small>`;
    card.innerHTML = `
      <p>${st.name} ${status}</p>
      <button onclick="showStudentDetail('${st.name}')">Ver detalle</button>
    `;
    c.appendChild(card);
  });
}

function populateWorkshops() {
  const c = document.getElementById("workshopList");
  c.innerHTML = "";
  workshops.forEach(w => {
    const card = document.createElement("div");
    card.className = "card workshop-card";
    const profSelect = `<select disabled><option>${w.professor}</option></select>`;
    const list = w.enrolled.map(st => {
      const stat = st.owed.includes(w.name) ? "Adeuda" : "Pagó";
      return `<li>${st.name} — <strong>${stat}</strong></li>`;
    }).join("");
    card.innerHTML = `
      <h3>${w.name}</h3>
      <label>Profesor@ a cargo:</label>${profSelect}
      <label>Valor:</label><p>$${w.price.toLocaleString()}</p>
      <h4>Inscriptos (${w.enrolled.length}):</h4>
      <ul class="enrolled-list">${list}</ul>
    `;
    c.appendChild(card);
  });
}

function showStudentDetail(name) {
  const st = studentProfiles.find(s => s.name === name);
  document.getElementById("detailName").textContent = st.name;
  const ul = document.getElementById("detailWorkshops");
  ul.innerHTML = "";
  let total = 0;
  workshops.forEach(w => {
    if (st.paid.includes(w.name) || st.owed.includes(w.name)) {
      const status = st.paid.includes(w.name) ? "Pagó" : "Adeuda";
      const li = document.createElement("li");
      li.textContent = `${w.name} — $${w.price.toLocaleString()} (${status})`;
      ul.appendChild(li);
      total += w.price;
    }
  });
  document.getElementById("detailTotal").textContent = `$${total.toLocaleString()}`;
  showSection('studentDetail');
}

// === INSCRIPCIONES ===
function setupRegistrationForm() {
  const sel = document.getElementById("regWorkshopSelect");
  sel.innerHTML = workshops.map(w =>
    `<option value="${w.name}">${w.name} — $${w.price.toLocaleString()}</option>`
  ).join("");
}

function processRegistration() {
  const name     = document.getElementById("regName").value;
  const phone    = document.getElementById("regPhone").value;
  const workshop = document.getElementById("regWorkshopSelect").value;
  const tbl = document.getElementById("inscrTable");
  tbl.innerHTML = `
    <tr><td>Nombre</td><td>${name}</td></tr>
    <tr><td>Teléfono</td><td>${phone}</td></tr>
    <tr><td>Taller</td><td>${workshop}</td></tr>
    <tr><td>Fecha</td><td>${
      new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    }</td></tr>
  `;
  showSection('registrationConfirmation');
}

// === PAGOS CON VALIDACIÓN ===
function setupPaymentForm() {
  document.getElementById("payStudentSelect").innerHTML =
    students.map(n => `<option>${n}</option>`).join("");
  document.getElementById("payWorkshopSelect").innerHTML =
    workshops.map(w => `<option value="${w.price}">${w.name}</option>`).join("");
}

function processPayment() {
  const student  = document.getElementById("payStudentSelect").value;
  const ws       = document.getElementById("payWorkshopSelect");
  const workshop = ws.selectedOptions[0].text;
  const price    = parseInt(ws.value, 10);
  const amount   = parseInt(document.getElementById("payAmount").value, 10);

  if (amount < price) {
    alert(`❌ Transferencia insuficiente.\nMonto mínimo: $${price.toLocaleString()}`);
    return;
  }

  const tbl = document.getElementById("confirmTable");
  tbl.innerHTML = `
    <tr><td>Estudiante</td><td>${student}</td></tr>
    <tr><td>Concepto</td><td>${workshop}</td></tr>
    <tr><td>Monto</td><td>$${amount.toLocaleString()}</td></tr>
    <tr><td>Fecha</td><td>${
      new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    }</td></tr>
  `;
  showSection('confirmation');
}

// === NOTIFICACIONES SIMULADAS ===
function notifyFeeIncrease() {
  workshops.forEach(w => {
    const newPrice = Math.round(w.price * 1.10);
    console.log(
      `WhatsApp → Inscriptos en ${w.name}: "Aviso: el arancel pasará de $${w.price.toLocaleString()} a $${newPrice.toLocaleString()}."`
    );
  });
  alert("Notificaciones de aumento de aranceles enviadas (simulado).");
}

function notifyPaymentReminders() {
  const owed = studentProfiles.filter(st => st.owed.length > 0);
  owed.forEach(st => {
    console.log(
      `WhatsApp → ${st.name}: "Usted adeuda los talleres: ${st.owed.join(", ")}. Por favor regularice."`
    );
  });
  alert(`Recordatorios enviados a ${owed.length} estudiantes (simulado).`);
}

// === NAVEGACIÓN ===
function showSection(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goHome(){ showSection('home'); }

// === INICIALIZACIÓN ===
window.addEventListener("DOMContentLoaded", () => {
  populateStudents();
  populateWorkshops();
  setupRegistrationForm();
  setupPaymentForm();
});
