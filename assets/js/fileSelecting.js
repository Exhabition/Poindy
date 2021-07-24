const { ipcRenderer, shell } = require("electron");

const selectStaticImageButton = document.getElementById("selectStaticImage");
const selectMovingImageButton = document.getElementById("selectMovingImage");

selectStaticImageButton.addEventListener("click", async () => {
    shell.beep();
    const response = await ipcRenderer.invoke("selectImage", [
        { name: "Porn", extensions: ["jpg", "png"] },
    ], "static").catch(error => alert(error));

    const replaceText = response || "None";
    document.getElementById("staticImageLabel").innerText = `Selected: ${replaceText}`;
    if (response) document.getElementById("staticImagePreview").src = response;
});

selectMovingImageButton.addEventListener("click", async event => {
    shell.beep();
    const response = await ipcRenderer.invoke("selectImage", [
        { name: "Hentai", extensions: ["gif"] },
    ], "dynamic").catch(error => alert(error));

    const replaceText = response || "None";
    document.getElementById("movingImageLabel").innerText = `Selected: ${replaceText}`;
});

function generateGifImage() {
    ipcRenderer.invoke("generateGifImage");
}