const socket = io();
const form = document.querySelector("#service-form");
const list = document.querySelector("#services-list");
const errorBox = document.querySelector("#form-error");
const successBox = document.querySelector("#form-success");
const connectionStatus = document.querySelector("#connection-status");
const navigationStatus = document.querySelector("#realtime-nav-status");
const submitButton = form.querySelector('button[type="submit"]');

const setConnectionState = (state) => {
  const labels = {
    connecting: "Conectando…",
    connected: "En vivo",
    disconnected: "Sin conexión",
  };

  if (connectionStatus) {
    connectionStatus.dataset.state = state;
    connectionStatus.textContent = labels[state];
  }

  if (navigationStatus) {
    navigationStatus.dataset.state = state;
  }

  submitButton.disabled = state !== "connected";
};

const createElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

const renderServices = (services) => {
  const fragment = document.createDocumentFragment();

  services.forEach((service) => {
    const card = document.createElement("li");
    card.className = "card service-card";
    card.dataset.id = service.id || service._id;
    card.append(
      createElement("p", "meta service-category", `${service.category} · ${service.duration} min`),
      createElement("h2", "", service.name),
      createElement("p", "service-description", service.description),
      createElement("p", "price", `USD ${service.price}`),
      createElement(
        "span",
        `badge ${service.available ? "ok" : "no"}`,
        service.available ? "Disponible" : "No disponible",
      ),
    );
    fragment.append(card);
  });

  if (services.length === 0) {
    fragment.append(createElement("li", "empty-state", "Todavía no hay servicios. Agrega el primero desde el formulario."));
  }

  list.replaceChildren(fragment);
};

setConnectionState(socket.connected ? "connected" : "connecting");

socket.on("connect", () => {
  setConnectionState("connected");
});

socket.on("disconnect", () => {
  setConnectionState("disconnected");
  if (successBox) successBox.hidden = true;
});

socket.on("connect_error", () => {
  setConnectionState("disconnected");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.hidden = true;
  if (successBox) successBox.hidden = true;

  if (!socket.connected) {
    errorBox.textContent = "Espera a que vuelva la conexión para enviar el servicio. Tus datos se conservan.";
    errorBox.hidden = false;
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.duration = Number(data.duration);
  data.price = Number(data.price);
  data.available = true;

  socket.emit("createService", data);
  if (successBox) {
    successBox.textContent = "Solicitud enviada. Esperando la actualización del tablero.";
    successBox.hidden = false;
  }
  // Keep the fields: the shared update event does not identify which request succeeded.
});

socket.on("servicesUpdated", (services) => {
  renderServices(services);
  if (successBox && !successBox.hidden) {
    successBox.textContent = "Tablero actualizado.";
  }
});

socket.on("serviceError", ({ message }) => {
  if (successBox) successBox.hidden = true;
  errorBox.hidden = false;
  errorBox.textContent = message;
});
