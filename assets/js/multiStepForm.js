let currentTab = 0;
showTab(currentTab);

function showTab(pos) {
    const tab = document.getElementsByClassName("tab");
    tab[pos].style.display = "block";

    if (pos == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (pos == tab.length - 1) {
        document.getElementById("nextBtn").innerHTML = "Submit";
        const color = window.getComputedStyle(document.documentElement).getPropertyValue("--green");
        document.getElementById("nextBtn").style.backgroundColor = color;
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    fixStepIndicator(pos);
}

async function nextPrev(n) {
    const x = document.getElementsByClassName("tab");
    if (n == 1 && !await validateForm()) return false;

    x[currentTab].style.display = "none";

    const tabInputs = x[currentTab].getElementsByTagName("input");
    if (tabInputs.length > 0) {
        for (const input of tabInputs) {
            if (input.value) await ipcRenderer.invoke("addOptionalStat", input.id, input.value);
        }
    }

    currentTab = currentTab + n;

    if (currentTab >= x.length) {
        generateGifImage();
        return false;
    }

    showTab(currentTab);
}

async function validateForm() {
    console.log("validateForm");
    let valid = false;

    const currentInfo = await ipcRenderer.invoke("getCurrentInfo");
    const currentOption = Object.values(currentInfo)[currentTab];
    console.log(currentOption);
    if (currentOption) {
        valid = true;
        document.getElementsByClassName("step")[currentTab].classList.add("finish");
    }

    if (!valid) showToast("Action not completed.");

    return valid;
}

function fixStepIndicator(n) {
    const stepIcon = document.getElementsByClassName("step");
    for (let i = 0; i < stepIcon.length; i++) {
        stepIcon[i].classList.remove("active");
    }

    stepIcon[n].classList.add("active");
}

function showToast(text, color = "#ed4245") {
    const toast = document.getElementById("toast");

    toast.innerHTML = text;
    toast.style.backgroundColor = color;
    toast.classList.add("show");

    setTimeout(function () { toast.classList.remove("show"); }, 3000);
}

function generateGifImage() {
    ipcRenderer.invoke("generateGifImage").then((result) => {
        showToast(`Image saved to <b>${result.save || "Unknown Location"}</b>`, "#3ba55d");
    });
}