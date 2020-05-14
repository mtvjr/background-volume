import Logger from "./common/logger.mjs"
import UpdateBackgroundVolume from "./volume.mjs"
import Templates from "./templates.mjs"

const MODULE_NAME = "background-volume";
const VOLUME_FLAG = "volume";

export function getVolume(scene) {
    const sceneVolume = scene.getFlag(MODULE_NAME, VOLUME_FLAG);
    if (typeof sceneVolume !== 'undefined') {
        return sceneVolume
    } else {
        Logger.log(Logger.Medium, `${scene.name} (${scene._id}) does not have a background volume saved.`);
        return 1;
    }
}

export async function setVolume(scene, volume) {
    if (volume == scene.getFlag(MODULE_NAME, VOLUME_FLAG)) {
        Logger.log(Logger.Low, `Volume of ${scene.name} has not changed.`);
        return;
    }
    Logger.log(Logger.High, `Setting background volume of ${scene.name} (${scene._id}) to ${volume} of type ${typeof volume}`);
    await scene.setFlag(MODULE_NAME, VOLUME_FLAG, volume);
}

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
        Logger.log(Logger.High, "Error parsing slider template");
        return;
    }

    const sliderDiv = $(sliderHTML)[0];

    // Find the 2nd horizontal rule, and add the volume slider before it
    html.find("hr")[1].before(sliderDiv);

    const sliderInput = html.find("#bvSlider");

    // Save changes to the slider when the form is being saved
    const form = html.find('form');
    form.submit(async () => {
        const newVolume = parseFloat(sliderInput.val());
        await setVolume(scene, newVolume);
    })
}
