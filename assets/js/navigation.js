const sidebar = document.querySelector(".sidebar");
const closeButton = document.querySelector("#btn");
const sideButtons = document.getElementsByClassName("sidebarButton");

closeButton.addEventListener("click", () => {
    toggleClass(sidebar, "open");
});

for (const sideButton of sideButtons) {
    sideButton.addEventListener("click", () => {
        toggleClass(sideButton, "active");
    });
}

function toggleClass(element, toAdd) {
    if (element.className.includes(toAdd)) {
        element.className = element.className.replace(toAdd, "");
    } else {
        element.className += ` ${toAdd}`;
    }
}