import * as model from "./model.js";
import * as utils from "./utils.js";

function main() {
    model.initializeSession();
    utils.inputSetup();
    utils.setupLinacPlots();
}

main();