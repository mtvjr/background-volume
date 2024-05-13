import Logger from "./common/logger.mjs"
import {getVolume} from "./settings.mjs"

/**
 * Sets the current audible volume of the current scene.
 * @param {float} newVolume - The new volume of the scene within [0-1]
 */
function updateVolume(newVolume) {
    if (canvas.ready) {
        for (const mesh of canvas.primary.videoMeshes) {
            mesh.sourceElement.volume = newVolume;
        }
    }
}

/**
 * Updates the background volume of the active scene
 */
export default function updateBackgroundVolume() {
    const scene = game.scenes.viewed;
    if (scene == undefined) {
        Logger.log(Logger.High, "Skipping volume update: No active scene.");
        return;
    }

    const ambient = game.settings.get("core", "globalAmbientVolume");
    const background = getVolume(scene);

    const newVolume = ambient * background;

    Logger.log(Logger.High, `Setting volume to ${newVolume}.`);
    updateVolume(newVolume);
}
