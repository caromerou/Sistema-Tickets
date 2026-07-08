function login() {
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    if (user === 'supervisor' && pass === 'generation2026IT') {
        localStorage.setItem('auth', 'true'); localStorage.setItem('rol', 'supervisor'); location.reload();
    } else if (user === 'agente' && pass === 'generation2026IT') {
        localStorage.setItem('auth', 'true'); localStorage.setItem('rol', 'agente'); location.reload();
    } else { alert("Credenciales incorrectas"); }
}

function logout() { localStorage.removeItem('auth'); localStorage.removeItem('rol'); location.reload(); }

function initApp() {
    document.getElementById('appSection').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
    cargarTickets();
}

window.onload = () => { if(localStorage.getItem('auth') === 'true') initApp(); };

function abrirModalNuevo() {
    document.getElementById('editId').value = '';
    new bootstrap.Modal(document.getElementById('modalTicket')).show();
}

function guardarTicket() {
    let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const id = document.getElementById('editId').value;
    
    if (id) {
        tickets = tickets.map(t => t.id == id ? { ...t, cliente: document.getElementById('cliente').value, dispositivo: document.getElementById('dispositivo').value, titulo: document.getElementById('titulo').value, desc: document.getElementById('desc').value, prioridad: document.getElementById('prioridad').value } : t);
    } else {
        tickets.push({ id: Date.now(), cliente: document.getElementById('cliente').value, dispositivo: document.getElementById('dispositivo').value, titulo: document.getElementById('titulo').value, desc: document.getElementById('desc').value, prioridad: document.getElementById('prioridad').value, estado: 'Abierto', creadoPor: localStorage.getItem('rol'), fecha: new Date().toLocaleDateString() });
    }
    localStorage.setItem('tickets', JSON.stringify(tickets));
    location.reload();
}

function editarTicket(id) {
    const tickets = JSON.parse(localStorage.getItem('tickets'));
    const t = tickets.find(t => t.id == id);
    document.getElementById('editId').value = t.id;
    document.getElementById('cliente').value = t.cliente;
    document.getElementById('dispositivo').value = t.dispositivo;
    document.getElementById('titulo').value = t.titulo;
    document.getElementById('desc').value = t.desc;
    document.getElementById('prioridad').value = t.prioridad;
    bootstrap.Modal.getInstance(document.getElementById('modalDetalle')).hide();
    new bootstrap.Modal(document.getElementById('modalTicket')).show();
}

function verDetalle(id) {
    const t = JSON.parse(localStorage.getItem('tickets')).find(t => t.id == id);
    document.getElementById('modalDetalleBody').innerHTML = `<p><strong>Cliente:</strong> ${t.cliente}</p><p><strong>Disp:</strong> ${t.dispositivo}</p><p><strong>Asunto:</strong> ${t.titulo}</p><p><strong>Desc:</strong> ${t.desc}</p>`;
    document.getElementById('modalDetalleFooter').innerHTML = `<button class="btn btn-warning" onclick="editarTicket(${t.id})">Editar</button><button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>`;
    new bootstrap.Modal(document.getElementById('modalDetalle')).show();
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("id", ev.target.id); }
function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("id");
    const nuevoEstado = ev.target.id.replace('col-', '');
    let tickets = JSON.parse(localStorage.getItem('tickets'));
    tickets = tickets.map(t => t.id == id ? {...t, estado: nuevoEstado} : t);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    location.reload();
}

function cargarTickets() {
    const rol = localStorage.getItem('rol');
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    tickets.forEach(t => {
        const card = document.createElement('div');
        card.className = "card p-3 shadow-sm"; card.id = t.id; card.draggable = true;
        card.ondragstart = drag; card.dataset.estado = t.estado.replace(' ', '');
        card.onclick = () => verDetalle(t.id);
        card.innerHTML = `<div class="d-flex justify-content-between"><span class="badge bg-secondary">${t.prioridad}</span><small>#${t.id.toString().slice(-4)}</small></div><h6 class="mt-2">${t.titulo}</h6>${(rol === 'supervisor') ? `<button class="btn btn-sm btn-danger py-0" onclick="event.stopPropagation(); eliminar(${t.id})">Borrar</button>` : ''}`;
        document.getElementById('col-' + t.estado.replace(' ', '')).appendChild(card);
    });
}

function eliminar(id) {
    let tickets = JSON.parse(localStorage.getItem('tickets')).filter(t => t.id !== id);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    location.reload();
}