import Logger from "./common/logger.mjs"
import {setVolume, createSceneSlider} from "./settings.mjs"
import updateBackgroundVolume from "./volume.mjs";

// Target for end users
const RELEASE = {
    level: Logger.Low,
    name: "Release"
}

// Target for running in foundry as a developer
const DEVEL = {
    logLevel: Logger.High,
    name: "Devel"
}

const Target = DEVEL;

// This new ambient slider function calls my update
// background volume function instead of setting the
// volume equal to the ambient volume
function newAmbientOnChange(volume) {
    updateBackgroundVolume();
    if (canvas.ready) {
        canvas.sounds.update();
    }
}

function init() {
    Logger.init("Background Volume", Target.logLevel);

    if (Target == DEVEL) {
        // Enable hook debugging
        CONFIG.debug.hooks = true;
    }

    Logger.log(Logger.Low, `Background Volume is initialized (${Target.name} target)`);
}

function ready() {
    Logger.log(Logger.Low, "Background Volume is ready");

    // Replace the default ambient volume changed function with my own
    game.settings.settings.get("core.globalAmbientVolume").onChange = newAmbientOnChange;

    updateBackgroundVolume();

    // Register hook to catch future updates
    Hooks.on("canvasReady", updateBackgroundVolume);
}

function onSceneUpdate(data, id, options) {
    // If the active scene was updated, update the background volume
    Logger.log(Logger.Low, "Scene was updated");
    if (game.scenes.active.id == id._id) {
        Logger.log(Logger.Low, "Active scene was updated");
        updateBackgroundVolume();
    }
}

Hooks.on("init", init);
Hooks.on("ready", ready);
Hooks.on("renderSceneConfig", createSceneSlider);
Hooks.on("updateScene", onSceneUpdate);
