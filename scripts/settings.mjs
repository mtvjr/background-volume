import Logger from "./common/logger.mjs"
import UpdateBackgroundVolume from "./volume.mjs"
import Templates from "./templates.mjs"

function newAmbientOnChange(volume) {
    UpdateBackgroundVolume();
    if (canvas.ready) {
        canvas.sounds.update();
    }
}

export function RegisterSettings() {
    Logger.log(Logger.Medium, "Updating ambient function");

    // Modify the ambient setting to prevent it from changing the background volume
    game.settings.settings.get("core.globalAmbientVolume").onChange = newAmbientOnChange;
}

export function CreatePlaylistSliders() {
    Logger.log(Logger.Medium, "Creating playlist sliders");

    // Ensure settings are registered
    RegisterSettings();

    if (game.user.isGM) {
        CreateAudioSlider("Max Background", "maxVolume");
    }

    CreateAudioSlider("Background", "clientVolume");
}

export async function CreateSceneSlider(sceneConfig, html, data) {
    Logger.log(Logger.Medium, "Creating scene slider");

    var scene = sceneConfig.object;

    // Set the background volume property if it doesn't exist
    if (!scene.hasOwnProperty("backgroundVolume")) {
        Logger.log(Logger.Medium, "Adding backgroundVolume to scene.");
        scene.backgroundVolume = 1;
    }

    const sliderHTML = await renderTemplate(Templates.SceneSlider, {
        label: "Background Volume",
        value: scene.backgroundVolume,
        max: 1,
        min: 0,
        step: 0.05
    });

    if (sliderHTML == "") {
        Logger.log(Logger.High, "Template not parsed");
        return;
    }

    const sliderDiv = $(sliderHTML)[0];

    // Find the 2nd horizontal rule, and add the volume slider before it
    html.find("hr")[1].before(sliderDiv);

    const sliderInput = html.find("#bvSlider");

    // Save changes to the slider when the form is being saved
    const form = html.find('form');
    form.submit(event => {
        const newVolume = sliderInput.val();
        Logger.log(Logger.High, `Scene volume changed to ${newVolume}`)
        scene.update({
            backgroundVolume: newVolume
        });
    })
}

export function OnSceneClose() {
    Logger.log(Logger.High, "Scene was saved");
    UpdateBackgroundVolume();
}
