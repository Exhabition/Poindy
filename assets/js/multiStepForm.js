let currentTab = 0;
showTab(currentTab);

function showTab(n) {
    const x = document.getElementsByClassName("tab");
    x[n].style.display = "block";

    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == x.length - 1) {
        document.getElementById("nextBtn").innerHTML = "Submit";
        const color = window.getComputedStyle(document.documentElement).getPropertyValue("--green");
        document.getElementById("nextBtn").style.backgroundColor = color;
        document.getElementById("nextBtn").setAttribute("onClick", "generateGifImage()");
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    fixStepIndicator(n);
}

async function nextPrev(n) {
    const x = document.getElementsByClassName("tab");
    if (n == 1 && !await validateForm()) return false;

    x[currentTab].style.display = "none";
    currentTab = currentTab + n;

    if (currentTab >= x.length) {
        document.getElementById("regForm").submit();
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
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }

    if (!valid) showToast("Action not completed.");

    return valid;
}

function fixStepIndicator(n) {
    const x = document.getElementsByClassName("step");
    for (let i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }

    x[n].className += " active";
}

function showToast(text) {
    const x = document.getElementById("toast");

    x.innerText = text;
    x.className = "show";

    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}