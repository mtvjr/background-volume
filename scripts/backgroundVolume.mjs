import Logger from "./common/logger.mjs"
import {RegisterSettings, OnSceneClose, CreateSceneSlider} from "./settings.mjs"
import UpdateBackgroundVolume from "./volume.mjs";

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

function init() {
    Logger.init("Background Volume", Target.logLevel);

    // Enable hook debugging
    // CONFIG.debug.hooks = true;

    Logger.log(Logger.Low, `Background Volume is initialized (${Target.name} target)`);
}

function ready() {
    Logger.log(Logger.Low, "Background Volume is ready");

    RegisterSettings();

    UpdateBackgroundVolume();

    // Register hook to catch future updates
    Hooks.on("canvasReady", UpdateBackgroundVolume);
}

Hooks.on("init", init);
Hooks.on("ready", ready);
Hooks.on("renderSceneConfig", CreateSceneSlider);
Hooks.on("closeSceneConfig", OnSceneClose);
