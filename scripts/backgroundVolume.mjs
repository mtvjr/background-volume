import Logger from "./common/logger.mjs"
import {createSceneSlider} from "./settings.mjs"
import updateBackgroundVolume from "./volume.mjs";

// Version
const VERSION = "v1.5.2";

// Target for end users
const RELEASE = {
    threshold: Logger.High,
    name: "Release"
}

// Target for running in foundry as a developer
const DEVEL = {
    threshold: Logger.Low,
    name: "Devel"
}

const Target = RELEASE;

function init() {
    Logger.init("Background Volume", Target.threshold);

    if (Target == DEVEL) {
        // Enable hook debugging
        CONFIG.debug.hooks = true;
    }

    Logger.log(Logger.High, `Background Volume ${VERSION} is initialized (${Target.name} target)`);
}

function ready() {
    Logger.log(Logger.Low, "Background Volume is ready");

    // Have the updateBackgroundVolume function be called when the ambient volume changes
    let orig = game.settings.settings.get("core.globalAmbientVolume").onChange;
    game.settings.settings.get("core.globalAmbientVolume").onChange = (...args) => {
        Logger.log(Logger.Low, "Ambient volume changed.");
        let ret = orig.apply(this, args);
        updateBackgroundVolume();
        return ret;
    }

    updateBackgroundVolume();

    // Register hook to catch future updates
    Hooks.on("canvasReady", updateBackgroundVolume);
}

function onSceneUpdate(data, id, options) {
    // If the viewed scene was updated, update the background volume
    Logger.log(Logger.Low, "A scene was updated");
    if (game.scenes.viewed.id == id._id) {
        Logger.log(Logger.High, "Received viewed scene update");
        updateBackgroundVolume();
    }
}

Hooks.on("init", init);
Hooks.on("ready", ready);
Hooks.on("renderSceneConfig", createSceneSlider);
Hooks.on("updateScene", onSceneUpdate);
