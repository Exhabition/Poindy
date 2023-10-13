
const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");
const formTitle = document.getElementById("form-title");

const TABS = {
    SELECT_STATIC: 0,
    SELECT_GIF: 1,
    SELECT_SETTINGS: 2,
    RESULTS_PAGE: 3,
}

let currentTab = 0;
showTab(currentTab);

function showTab(pos) {
    const tab = document.getElementsByClassName("tab");
    tab[pos].style.display = "block";

    if (pos === 0) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "inline";
    }

    if (pos === TABS.SELECT_SETTINGS) {
        const submitColor = window.getComputedStyle(document.documentElement).getPropertyValue("--green");

        nextButton.innerText = "Submit";
        nextButton.style.backgroundColor = submitColor;
    } else if (pos === TABS.RESULTS_PAGE) {
        const disabledColor = window.getComputedStyle(document.documentElement).getPropertyValue("--icons-grey");

        formTitle.innerText = "Waiting for Results...";

        nextButton.innerText = "Finish";
        nextButton.style.backgroundColor = disabledColor;

        console.log("genning")
        generateGifImage();
    } else {
        nextButton.innerText = "Next";
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

    showTab(currentTab);
}

async function validateForm() {
    let valid = false;

    const currentInfo = await ipcRenderer.invoke("getCurrentInfo");
    const currentOption = Object.values(currentInfo)[currentTab];
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
    subscribeForProgress();

    ipcRenderer.invoke("generateGifImage").then((result) => {
        showToast(`Image saved to <b>${result.save || "Unknown Location"}</b>`, "#3ba55d");

        unsubscribeForProgress();
    });
}



function subscribeForProgress() {
    ipcRenderer.on("generateProgress", (event, progessPercentage) => {
        console.log(event, progessPercentage);

        setProgress(progessPercentage);
    });
}

function unsubscribeForProgress() {
    ipcRenderer.removeAllListeners("generateProgress");
}

function setProgress(widthPercentage) {
    const styleTag = document.getElementById('custom-progress-animation');
    if (styleTag) {
      styleTag.remove();
    }

    const progressBar = document.getElementById("progress-bar");
    console.log(progressBar.style.width)
    const currentWidth = parseInt(progressBar.style.width.slice(0, -1));

    const secondsPerPercent = 0.5;
    const animationLength = secondsPerPercent * (widthPercentage - currentWidth);
    console.log(animationLength);
  
    const style = document.createElement('style');
    style.id = 'custom-progress-animation';
    style.innerHTML = `
      @keyframes custom-progress {
        0% {
          width: ${currentWidth}%;
          background: var(--soft-pink);
        }
        100% {
          width: ${widthPercentage}%;
          background: var(--blurple);
        }
      }
  
      .progress-moved #progress-bar {
        animation: custom-progress ${animationLength}s;
      }
    `;
  
    document.head.appendChild(style);

    progressBar.style.width = widthPercentage + '%';
  }