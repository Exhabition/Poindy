const { ipcRenderer, shell } = require("electron");

const selectStaticImageButton = document.getElementById("selectStaticImage");
const selectMovingImageButton = document.getElementById("selectMovingImage");
const selectSaveLocationButton = document.getElementById("selectSaveLocation");

selectStaticImageButton.addEventListener("click", async () => {
    shell.beep();
    const response = await ipcRenderer.invoke("selectImage", [
        { name: "Image", extensions: ["jpg", "png"] },
    ], "static").catch(error => alert(error));

    const replaceText = response || "None";
    document.getElementById("staticImageLabel").innerText = `Selected: ${replaceText}`;
    if (response) document.getElementById("staticImagePreview").src = response;
});

selectMovingImageButton.addEventListener("click", async event => {
    shell.beep();
    const response = await ipcRenderer.invoke("selectImage", [
        { name: "GIF", extensions: ["gif"] },
    ], "dynamic").catch(error => alert(error));

    const replaceText = response || "None";
    document.getElementById("movingImageLabel").innerText = `Selected: ${replaceText}`;
    if (response) document.getElementById("movingImagePreview").src = response;
});

selectSaveLocationButton.addEventListener("click", async event => {
    shell.beep();
    const response = await ipcRenderer.invoke("changeSaveLocation").catch(error => alert(error));

    const replaceText = response || "None";
    document.getElementById("saveLocationLabel").innerText = `Selected: ${replaceText}`;
});