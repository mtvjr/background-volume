import Logger from "./common/logger.mjs"

function getBackgroundVolume() {
    const scene = game.scenes.active.options;

    if (scene.hasOwnProperty("backgroundVolume")) {
        Logger.log(Logger.Low, `Retrieved volume ${scene.backgroundVolume}`);
        return scene.backgroundVolume;
    }

    Logger.log(Logger.Low, "Unable to find background volume for the scene.");
    return 1;
}

export default function UpdateBackgroundVolume() {
    if (canvas.ready && canvas.background.isVideo) {
        const ambient = game.settings.get("core", "globalAmbientVolume");
        const scene = getBackgroundVolume();

        const newVolume = ambient * scene;

        Logger.log(Logger.High, `Setting volume to ${newVolume}.`)
        canvas.background.source.volume = newVolume;
    }
}
