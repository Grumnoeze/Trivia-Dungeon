document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        const exitButton = document.getElementById("btn-exit");

        if (exitButton) {
            // activar efecto visual
            exitButton.classList.add("active-key");

            // ejecutar clic
            exitButton.click();
        }
    }
});
