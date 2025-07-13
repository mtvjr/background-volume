import Logger from "./common/logger.mjs"
import UpdateBackgroundVolume from "./volume.mjs"
import Templates from "./templates.mjs"

const MODULE_NAME = "background-volume";
const VOLUME_FLAG = "volume";
const SLIDER_ID = "bvSlider";
const renderTemplate = foundry.applications.handlebars.renderTemplate;

/**
 * Get the background volume of a scene
 * @return The volume of the scene
 */
export function getVolume(scene) {
    const sceneVolume = scene.getFlag(MODULE_NAME, VOLUME_FLAG);
    if (typeof sceneVolume !== 'undefined') {
        return sceneVolume
    } else {
        Logger.log(Logger.Medium, `${scene.name} (${scene._id}) does not have a background volume saved.`);
        return 1;
    }
}

/**
 * Set the background volume setting for a scene
 * @param scene - The scene to modify
 * @param volume - The new background volume of the scene
 */
export async function setVolume(scene, volume) {
    if (volume == scene.getFlag(MODULE_NAME, VOLUME_FLAG)) {
        Logger.log(Logger.Low, `Volume of ${scene.name} has not changed.`);
        return;
    }
    Logger.log(Logger.High, `Setting background volume of ${scene.name} to ${volume}`);
    await scene.setFlag(MODULE_NAME, VOLUME_FLAG, volume);
}

/**
 * Get the localization text for a key.
 * @param {String} key - The localization key, not including the module name
 * @return {String} - The localization text.
 */
function localize(key) {
    return game.i18n.localize(`${MODULE_NAME}.${key}`);
}

/**
 * Adds a Background Volume scene slider to a SceneConfig
 * @param {SceneConfig} sceneConfig - A SceneConfig object
 * @param form - The form DOM object representing the scene config
 * @param data - The data used to populate sceneConfig
 */
export async function createSceneSlider(sceneConfig, form, data) {
    Logger.log(Logger.Medium, "Creating scene slider");

    var scene = sceneConfig.document;
    const oldVolume = getVolume(scene);

    const sliderHTML = await renderTemplate(Templates.SceneSlider, {
        label: localize("slider-title"),
        hint: localize("slider-hint"),
        id: SLIDER_ID,
        value: oldVolume,
        max: 1,
        min: 0,
        step: 0.05
    });

    if (sliderHTML == "") {
        Logger.log(Logger.High, "Error parsing slider template. Unable to add slider");
        return;
    }

    var sliderDiv = $.parseHTML(sliderHTML)[0];

    // Find the 'Journal Notes' option and add the background volume config option before it
    // This should place it near the top of the 'Ambience and Atmosphere' section
    const basicOptions = form.querySelector("div[data-group='ambience'][data-tab='basic']");
    basicOptions.insertBefore(sliderDiv, basicOptions.firstChild);

    const sliderInput = form.querySelector(`#${SLIDER_ID}`);

    // Save changes to the slider when the form is being saved
    form.addEventListener('submit', () => {
        const newVolume = parseFloat(sliderInput.value);
        setVolume(scene, newVolume);
    });

    // Reposition the form to accomidate the new contents
    sceneConfig.setPosition();
}
