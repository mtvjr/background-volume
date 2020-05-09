export default class Logger {
    // Enumerate the log levels
    static None = 0;
    static Low = 2;
    static Medium = 3;
    static High = 4;

    static Levels = [
        "none",
        "low",
        "medium",
        "high"
    ];

    static moduleName = "Unnamed Module";
    static debugLevel = 0;

    static init(name, level) {
        Logger.moduleName = name;
        this.debugLevel = level;
        
        this.log(level, `Set log level to ${Logger.Levels[level]}`);
    }

    static log(level, message) {
        if (level <= Logger.debugLevel) {
            console.log(this.moduleName + ' | ' + message);
        }
    }
}