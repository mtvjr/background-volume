import Logger from "./common/logger.mjs"
import UpdateBackgroundVolume from "./volume.mjs"
import Templates from "./templates.mjs"

const MODULE_NAME = "background-volume";
const VOLUME_FLAG = "volume";

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
 * Adds a Background Volume scene slider to a SceneConfig
 * @param {SceneConfig} sceneConfig - A SceneConfig object
 * @param html - The JQuery HTML object representing the scene config
 * @param data - The data used to populate sceneConfig
 */
export async function createSceneSlider(sceneConfig, html, data) {
    Logger.log(Logger.Medium, "Creating scene slider");

    var scene = sceneConfig.object;
    const oldVolume = getVolume(scene);

    const sliderHTML = await renderTemplate(Templates.SceneSlider, {
        label: "Background Volume",
        value: oldVolume,
        max: 1,
        min: 0,
        step: 0.05
    });

    if (sliderHTML == "") {
        Logger.log(Logger.High, "Error parsing slider template. Unable to add slider");
        return;
    }

    const sliderDiv = $(sliderHTML)[0];

    // Find the 4th header, and add the volume slider after it
    html.find("h3")[3].after(sliderDiv);

    const sliderInput = html.find("#bvSlider");

    // Save changes to the slider when the form is being saved
    const form = html.find('form');
    form.submit(async () => {
        const newVolume = parseFloat(sliderInput.val());
        await setVolume(scene, newVolume);
    })
}
