const form = document.querySelector("#booking-form");
const message = document.querySelector("#booking-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.hidden = true;

    const formData = new FormData(form);

    const data = {
        clientName: formData.get("clientName"),
        clientEmail: formData.get("clientEmail"),
        date: formData.get("date"),
        time: formData.get("time"),

        services: [
            {
                service: formData.get("serviceId"),
                quantity: 1,
            }
        ]
    };

    try {
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            message.hidden = false;
            message.textContent =
                result.message || "No se pudo crear la reserva";
            return;
        }

        message.hidden = false;
        message.classList.remove("error");
        message.textContent = "Reserva creada con éxito";

        form.reset();

        setTimeout(() => {
            window.location.href = "/bookings";
        }, 1500);

    } catch (error) {
        console.error(error);
        message.hidden = false;
        message.textContent = "Ocurrió un error al crear la reserva";
    }
});