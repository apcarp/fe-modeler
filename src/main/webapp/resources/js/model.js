// Uses ort from js/lib/ort-v1.10.0.min.js

import * as utils from "./utils.js";
import * as charts from "./charts.js";

let session = null;
let c100OperationalMax = 25;
let modelFile = "resources/model/MLPReluWide-2021-12-02_125735.onnx";

// use an async context to call onnxruntime functions.
async function initializeSession() {
    try {
        // create a new session and load the specific model.
        session = await ort.InferenceSession.create(modelFile);
    } catch (e) {
        let errorBanner = document.getElementById("error-banner");
        let newDiv = document.createElement("div");
        newDiv.innerText = `Failed to create inference session for ONNX model. ${e}.`;
        errorBanner.appendChild(newDiv);
    }
}

async function modelPredict() {
    try {
        let gsetInputs = document.getElementsByClassName("gradient-input");
        let onsetInputs = document.getElementsByClassName("fe-onset-input");
        let inputs = new Float32Array(64);
        for (let i = 0; i < 32; i++) {
            inputs[i] = gsetInputs[i].value;
        }
        for (let i = 0; i < 32; i++) {
            inputs[32+i] = onsetInputs[i].value;
        }

        // Normalize the inputs according to the model standard.
        for (let i = 0; i < inputs.length; i++) {
            inputs[i] = inputs[i] / c100OperationalMax;
        }

        // prepare feeds. use model input names as keys.
        const inputTensor = new ort.Tensor('float32', inputs, [1, 64]);
        const feeds = {"input": inputTensor};

        // feed inputs and run
        const results = await session.run(feeds);

        // read from results
        const output = results.output.data;

        // let resultString = document.createElement("div");
        // resultString.textContent = output.toString();
        // document.getElementById("results-panel").appendChild(resultString);

        output.forEach(function(value, index) {
            let rad = 'n-pred-';
            let chartId = "-neutron-chart";
            let i = index;
            if (index > 5){
                rad = 'g-pred-';
                chartId = '-gamma-chart';
                i = index - 6;
            }
            document.getElementById(rad + (i+1)).textContent = value.toFixed(2);
            chartId = "1L2" +(2+i) + chartId;
            charts.updateChartData(chartId, [value]);
        });
    } catch (e) {
        let msg = document.createElement("div");
        msg.innerText = `Model inference failed. ${e}.`;
        utils.displayError(msg)
    }
}

export {initializeSession, modelPredict}