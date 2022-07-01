import Logger from "./common/logger.mjs"
import {getVolume} from "./settings.mjs"

/**
 * Sets the current audible volume of the current scene.
 * @note This function only works on Foundry V9 and earlier. For later versions, use _V10
 * @param {float} newVolume - The new volume of the scene within [0-1]
 */
function updateVolume_V9(newVolume) {
    if (canvas.ready && canvas.background.isVideo) {
        canvas.background.bgSource.volume = newVolume;
    }
}

/**
 * Sets the current audible volume of the current scene.
 * @note This function only works on Foundry V10 and later. For earlier versions, use _V9
 * @param {float} newVolume - The new volume of the scene within [0-1]
 */
function updateVolume_V10(newVolume) {
    if (canvas.ready) {
        for ( const mesh of canvas.primary.videoMeshes ) {
            mesh.sourceElement.volume = newVolume;
        }
    }
}

/**
 * Updates the background volume of the active scene
 */
export default function updateBackgroundVolume() {
    const ambient = game.settings.get("core", "globalAmbientVolume");
    const background = getVolume(game.scenes.viewed);

    const newVolume = ambient * background;

    Logger.log(Logger.High, `Setting volume to ${newVolume}.`);
    if (game.release.isNewer("9.269")) {
        updateVolume_V10(newVolume);
    } else {
        updateVolume_V9(newVolume);
    }
}
