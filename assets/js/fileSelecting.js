const ipc = require("electron").ipcRenderer;
const { shell } = require("electron");

const selectStaticImageButton = document.getElementById("selectStaticImage");
const selectMovingImageButton = document.getElementById("selectMovingImage");
const submitButton = document.getElementById("submitImages");

selectStaticImageButton.addEventListener("click", event => {
    shell.beep();
    ipc.send("selectImage", [
        { name: "Porn", extensions: ["jpg", "png"] },
    ], "static");
});

selectMovingImageButton.addEventListener("click", event => {
    console.log(event);
    shell.beep();
    ipc.send("selectImage", [
        { name: "Hentai", extensions: ["gif"] },
    ], "dynamic");
});

submitButton.addEventListener("click", event => {
    ipc.send("generateGifImage");
});