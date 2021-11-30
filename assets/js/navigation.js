const sidebar = document.querySelector(".sidebar");
const closeButton = document.querySelector("#btn");
const sideButtons = document.getElementsByClassName("sidebarButton");

closeButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

for (const sideButton of sideButtons) {
    sideButton.addEventListener("click", () => {
        sideButton.classList.toggle("active");
    });
}