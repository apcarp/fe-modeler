import * as model from "./model.js";
import * as charts from "./charts.js";
import {config} from "./config.js";

function inputSetup() {
    let mDiv = document.getElementById("model-inputs-panel");

    let zones = ['1L22', '1L23', '1L24', '1L25'];
    let zone2epics = {'1L22': 'R1M', '1L23': 'R1N', '1L24': 'R1O', '1L25': 'R1P'};

    // for (let zone in ['1L22', '1L23', '1L24', '1L25']) {
    zones.forEach(function (zone) {
        let zDiv = document.createElement('div');
        zDiv.setAttribute('id', zone + '-inputs');
        zDiv.setAttribute('class', 'zone-input');

        let gDiv = document.createElement("div");
        let fDiv = document.createElement("div");
        gDiv.setAttribute('class', 'gradient-input-row');
        gDiv.setAttribute('id', 'gradient-input-row-' + zone);
        fDiv.setAttribute('class', 'fe-onset-input-row');
        fDiv.setAttribute('id', 'fe-onset-input-row-' + zone);

        let gLabel = document.createElement('div');
        gLabel.setAttribute('class', 'gradient-input-label');
        gLabel.textContent = zone + " GSET";
        gLabel.dataset.epicsName = zone2epics[zone];
        gLabel.dataset.cedName = zone;
        gDiv.appendChild(gLabel);

        let fLabel = document.createElement('div');
        fLabel.setAttribute('class', 'fe-onset-input-label');
        fLabel.textContent = zone + " FE Onset";
        fLabel.dataset.epicsName = zone2epics[zone];
        fLabel.dataset.cedName = zone;
        fDiv.appendChild(fLabel);

        for (let cavNum = 1; cavNum <= 8; cavNum++) {
            let gInput = document.createElement("input");
            gInput.setAttribute('type', 'number');
            gInput.setAttribute('id', 'grad-input-' + zone + "-" + cavNum);
            gInput.value = '0';
            gInput.setAttribute('step', '0.1');
            gInput.classList.add("cavity-input");
            gInput.classList.add("gradient-input");
            gInput.dataset.epicsName = zone2epics[zone] + cavNum;
            gInput.dataset.cedName = zone + "-" + cavNum;
            gInput.dataset.odvh = "25";
            gInput.dataset.originalVal = "0";
            gInput.addEventListener('input', inputEventHandler);
            gDiv.appendChild(gInput);

            let fInput = document.createElement("input");
            fInput.setAttribute('type', 'number');
            fInput.setAttribute('id', 'fe-onset-input-' + zone + "-" + cavNum);
            fInput.value = '0';
            fInput.setAttribute('step', '0.1');
            fInput.classList.add("cavity-input");
            fInput.classList.add("fe-onset-input");
            fInput.dataset.epicsName = zone2epics[zone] + cavNum;
            fInput.dataset.cedName = zone + "-" + cavNum;
            fInput.dataset.odvh = "25";
            fInput.dataset.originalVal = "0";
            fInput.addEventListener('input', inputEventHandler);
            fDiv.appendChild(fInput);
        }
        zDiv.appendChild(gDiv);
        zDiv.appendChild(fDiv);

        mDiv.appendChild(zDiv);
    });

    let inputForm = document.getElementById("model-inputs");
    let predictButton = document.createElement("button");
    predictButton.setAttribute('id', 'model-predict-button');
    predictButton.innerText = "Predict";
    predictButton.setAttribute("type", 'button');
    predictButton.addEventListener('click', model.modelPredict);
    inputForm.appendChild(predictButton);

    let getPvButton = document.createElement("button");
    getPvButton.setAttribute('id', 'caget-button');
    getPvButton.innerText = "Import Values";
    getPvButton.setAttribute("type", 'button');
    getPvButton.addEventListener('click', updateRfInputValues);
    inputForm.appendChild(getPvButton);

    let getCaButton = document.createElement("button");
    getCaButton.setAttribute('id', 'capuut-button');
    getCaButton.innerText = "Download CA Commands";
    getCaButton.setAttribute("type", 'button');
    getCaButton.addEventListener('click', function() {
        triggerDownload("caput-commands.txt", getCaputCommands());
    }, false);
    inputForm.appendChild(getCaButton);
}

function inputEventHandler(event) {
    let elem = document.getElementById(event.target.id);

    // Allow UI indications that we're over ODVH
    if (parseFloat(event.target.value) > parseFloat(elem.dataset.odvh)) {
        elem.classList.add("over-odvh");
    } else {
        elem.classList.remove("over-odvh");
    }

    // Allow UI indications that we've modified this value
    if (event.target.value !== elem.dataset.originalVal) {
        elem.classList.add('modified-val');
    } else {
        elem.classList.remove('modified-val');
    }
}

function setupLinacPlots() {
    charts.makeNeutronChart("1L22-neutron-chart");
    charts.makeNeutronChart("1L23-neutron-chart");
    charts.makeNeutronChart("1L24-neutron-chart");
    charts.makeNeutronChart("1L25-neutron-chart");
    charts.makeNeutronChart("1L26-neutron-chart");
    charts.makeNeutronChart("1L27-neutron-chart");

    charts.makeGammaChart("1L22-gamma-chart");
    charts.makeGammaChart("1L23-gamma-chart");
    charts.makeGammaChart("1L24-gamma-chart");
    charts.makeGammaChart("1L25-gamma-chart");
    charts.makeGammaChart("1L26-gamma-chart");
    charts.makeGammaChart("1L27-gamma-chart");

    charts.makeCMChart("1L22-gradient-chart");
    charts.makeCMChart("1L23-gradient-chart");
    charts.makeCMChart("1L24-gradient-chart");
    charts.makeCMChart("1L25-gradient-chart");
}


function updateRfInputValues() {

    // Get a list of model input fields
    let inputs = document.getElementsByClassName("cavity-input");

    // Construct the query URL based on the EPICSNames present in the input fields.  This URL object is a throw away
    // used only to process the params.
    let url = new URL("http://locahost/");
    config.PVs.forEach(pvname => url.searchParams.append("pv", pvname));

    // Grab the current GSET and ODVH values from an EPICS2WEB gateway.  Update the input elements accordingly.
    fetch(config.cagetUrl + url.search)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('caget response was not OK');
            }
        })
        .then(responseJson => {
            for (let i = 0; i < inputs.length; i++) {
                let foundGset = false;
                let foundOdvh = false;
                let gset = inputs[i].dataset.epicsName + "GSET";
                let odvh = inputs[i].dataset.epicsName + "ODVH";
                responseJson.data.forEach(pv => {
                    if (pv.name === gset) {
                        // Only update the input value if it's a gradient input.
                        if (inputs[i].classList.contains('gradient-input')) {
                            let changed = inputs[i].value !== pv.value;
                            inputs[i].value = pv.value;
                            inputs[i].dataset.originalVal = pv.value;
                            if (changed) {
                                inputs[i].dispatchEvent(new Event("input", {bubbles: true, cancelable: true}));
                            }
                        }
                        foundGset = true;
                    } else if (pv.name === odvh) {
                        inputs[i].dataset.odvh = pv.value;
                        foundOdvh = true;
                    }
                });
                if (!foundGset) {
                    let msg = document.createElement("p");
                    msg.textContent = "Error querying GSET for " + inputs[i].dataset.cedName;
                    displayError(msg)
                }
                if (!foundOdvh) {
                    let msg = document.createElement("p");
                    msg.textContent = "Error querying ODVH for " + inputs[i].dataset.cedName;
                    displayError(msg)
                }
            }

            // Update the gradient charts to reflect the new data.
            updateAllGradientCharts();
        })
        .catch(error => {
            let msg = document.createElement("p");
            msg.textContent = error.toString();
            displayError(msg);
        });

    fetch("ajax/fe-onsets")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('fe-onsets response was not OK');
            }
        })
        .then(responseJson => {
            for (let i = 0; i < inputs.length; i++) {
                let onsetName = inputs[i].dataset.epicsName + "ONSET";
                let foundOnset = false;
                responseJson.data.forEach(onset => {
                    if (onset.name === onsetName) {
                        // Only update the input value if it's a fe-onset input.
                        if (inputs[i].classList.contains('fe-onset-input')) {
                            let changed = inputs[i].value !== onset.value;
                            inputs[i].value = onset.value;
                            inputs[i].dataset.originalVal = onset.value;
                            if (changed) {
                                inputs[i].dispatchEvent(new Event("input", {bubbles: true, cancelable: true}));
                            }
                        }
                        foundOnset = true;
                    }
                });
                if (!foundOnset) {
                    let msg = document.createElement("p");
                    msg.textContent = "Error querying FE Onset for " + inputs[i].dataset.cedName;
                    displayError(msg)
                }
            }
        })
        .catch(error => {
            let msg = document.createElement("p");
            msg.textContent = error.toString();
            displayError(msg);
        });
}

function updateAllGradientCharts() {
    // Update the gradient charts to reflect the new data.
    updateGradientChart("1L22");
    updateGradientChart("1L23");
    updateGradientChart("1L24");
    updateGradientChart("1L25");
}

// Update the gradient chart for the given zone to match the values in the input form
function updateGradientChart(zone) {
    let data = new Array(8);
    let inputs = document.getElementById("gradient-input-row-" + zone).getElementsByClassName('gradient-input');
    for (let i = 0; i < inputs.length; i++) {
        data[i] = inputs[i].value;
    }
    charts.updateChartData(zone + "-gradient-chart", data);
}

// Trigger download of file with name filename and content text via Temporaru creation an 'a' tag
function triggerDownload(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.dislpay = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getCaputCommands() {
    let inputs = document.getElementById("model-inputs-panel").getElementsByClassName("gradient-input modified-val");

    if (inputs.length === 0) {
        return "No changes to GSETs.";
    }
    let commands = new Array(inputs.length);
    for (let i = 0; i < inputs.length; i++) {
        commands[i] = 'caput ' + inputs[i].dataset.epicsName + "GSET " + inputs[i].value;
    }

    return commands.join("\n");
}

function displayError(msg) {
    let banner = document.getElementById("error-banner");
    banner.insertBefore(msg, banner.firstChild);
}

export {displayError, setupLinacPlots, inputSetup};
