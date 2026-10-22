import routes from "./routes.js";

const key = "1683211394739";
const frame = "false";
const language = "ru";

const maxGuestCount = 18;
const minimalPrice = 100;

const toursComboBox = document.querySelector("#purchase-panel select");
const adultSlider = document.querySelector(
    "#purchase-panel input[name='adult-count']"
);
const childSlider = document.querySelector(
    "#purchase-panel input[name='child-count']"
);
const tags = document.querySelectorAll("#purchase-panel span.tag");
const tourPriceField = document.querySelector(
    "#purchase-panel input[type='number']"
);
const submitButton = document.querySelector(
    "#purchase-panel button[type='submit']"
);
const terminalKey = document.querySelector(
    "#purchase-panel input[name='terminalkey']"
);
const terminalFrame = document.querySelector(
    "#purchase-panel input[name='frame']"
);
const terminalLanguage = document.querySelector(
    "#purchase-panel input[name='language']"
);
const terminalDescription = document.querySelector(
    "#purchase-panel input[name='description']"
);
const fullAmount = document.querySelector(
    "#purchase-panel input[name='amount']"
);

function getCurrentRouteName() {
    return toursComboBox.value.split("-")[0].trim();
}

function getCurrentTourName() {
    return toursComboBox.value.split("-")[1].trim();
}

function getCurrentTour() {
    const currentRouteName = getCurrentRouteName();
    const currentTourName = getCurrentTourName();
    for (let route of routes) {
        if (route.name === currentRouteName) {
            for (let tour of route.tours) {
                if (tour.name === currentTourName) {
                    return tour;
                }
            }
        }
    }
}

function calcTourPrice(manualInput=false) {
    const currentRouteName = getCurrentRouteName();
    const currentTourName = getCurrentTourName();
    const currentTour = getCurrentTour();
    if (!manualInput) {
        tourPriceField.value = (
            adultSlider.value * currentTour.price.adult + 
            childSlider.value * currentTour.price.child
        );
    }
    fullAmount.value = tourPriceField.value;
    terminalDescription.value = `${currentRouteName} - ${currentTourName}. Взрослых - ${adultSlider.value}. Детей - ${childSlider.value}.`;
}

window.onload = () => {
    toursComboBox.dispatchEvent(new Event("change"));
    adultSlider.dispatchEvent(new Event("input"));
    childSlider.dispatchEvent(new Event("input"));
}

toursComboBox.addEventListener("change", () => {
    const currentTour = getCurrentTour();
    if (currentTour.price.child === 0) {
        childSlider.setAttribute("disabled", "");
        childSlider.value = 0;
        childSlider.dispatchEvent(new Event("input"));
    } else {
        childSlider.removeAttribute("disabled");
    }
    calcTourPrice();
});

adultSlider.addEventListener("input", () => {
    tags[0].innerHTML = String(adultSlider.value).padStart(2, "0");
    calcTourPrice();
});

childSlider.addEventListener("input", () => {
    tags[1].innerHTML = String(childSlider.value).padStart(2, "0");
    calcTourPrice();
});

tourPriceField.addEventListener("change", () => {
    calcTourPrice(true);
});

submitButton.addEventListener("click", (e) => {
    if (tourPriceField.value < minimalPrice) {
        e.preventDefault();
        window.alert(`Минимальный размер платежа ${minimalPrice} рублей`);
        return;
    }
    if ((Number(adultSlider.value) + Number(childSlider.value)) > 18) {
        e.preventDefault();
        window.alert(`Максимальное количество гостей ${maxGuestCount}`);
        return;
    }
});

terminalKey.value = key;
terminalFrame.value = frame;
terminalLanguage.value = language;

for (let route of routes) {
    for (let tour of route.tours) {
        let comboBoxOption = document.createElement("option");
        let comboBoxOptionText = document.createTextNode(
            route.name + " - " + tour.name
        );
        comboBoxOption.appendChild(comboBoxOptionText);
        toursComboBox.appendChild(comboBoxOption);
    }
}