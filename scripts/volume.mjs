import Logger from "./common/logger.mjs"
import {getVolume} from "./settings.mjs"

export default function updateBackgroundVolume() {
    if (canvas.ready && canvas.background.isVideo) {
        const ambient = game.settings.get("core", "globalAmbientVolume");
        const background = getVolume(game.scenes.active);

        const newVolume = ambient * background;

        Logger.log(Logger.High, `Setting volume to ${newVolume}.`)
        canvas.background.source.volume = newVolume;
    }
}
