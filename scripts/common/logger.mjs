export default class Logger {
    // Enumerate the log levels
    static None = {
        value: 0,
        name: "none"
    }

    static Low = {
        value: 1,
        name: "low"
    }

    static Medium = {
        value: 2,
        name: "medium"
    }

    static High = {
        value: 3,
        name: "high"
    }

    static moduleName = "Unnamed Module";
    static debugLevel = 0;

    static init(name, level) {
        Logger.moduleName = name;
        this.debugLevel = level;
        
        this.log(level, `Set log level to ${level.name}`);
    }

    static log(level, message) {
        if (level.value <= Logger.debugLevel.value) {
            console.log(this.moduleName + ' | ' + message);
        }
    }
}
