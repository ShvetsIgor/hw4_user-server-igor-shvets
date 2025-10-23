import {EventEmitter} from "node:events";

class Logger extends EventEmitter {

    private logArray: Array<{date: string, message: string}> = [];

    addLogToArray(message: string) {
        this.logArray.push({date: new Date().toISOString(), message})
    }

    getLogArray() {
        return [...this.logArray] //copy of an array
    }


    log(message: string) {
        this.emit('logged', message)
    }

    save(message: string) {
        this.emit('saved', message)
    }
}

// сначала делаем эмиттер
//затем класс логер, расширяющий эмиттер,
//затем создаем свой логер через конструктор


export const myLogger = new Logger();

myLogger.on('logged', (message: string)=> {
    console.log(new Date().toISOString(), message)
})

myLogger.on('saved', (message:string)=> {
    myLogger.addLogToArray(message);
    console.log(new Date().toISOString(), message)
})