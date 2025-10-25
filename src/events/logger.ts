import {EventEmitter} from "node:events";
import * as fs from "node:fs";

class Logger extends EventEmitter {

    private logArray: Array<{date: string, message: string}> = [];
    private fs = fs;

    addLogToArray(message: string) {
        const date = new Date().toISOString();
        this.logArray.push({date, message})
        this.logToFile(message, date)
    }

    getLogArray() {
        return [...this.logArray] //copy of an array
    }

    log(message: string) {
        this.emit('logged', message)
        this.logToFile(message)
    }

    save(message: string) {
        this.emit('saved', message)
    }

    logToFile(message: string, date?: string) {
        const time = date ?? new Date().toISOString();
        this.fs.writeFileSync('myLog.txt', `[${time}] ${message}\n`, {flag: 'a+'})
    }
}

// сначала делаем эмиттер
//затем класс логер, расширяющий эмиттер,
//затем создаем свой логер через конструктор


export const myLogger = new Logger();

myLogger.on('logged', (message: string)=> {
    // fs.writeFileSync('myLog.txt', message + ' ' + new Date().toISOString() + '\n', {flag: 'a+'})   //var.1
    // myLogger.logToFile(message);  //var.2
    console.log(new Date().toISOString(), message)
})

myLogger.on('saved', (message:string)=> {
    myLogger.addLogToArray(message);
    // myLogger.logToFile(message);  //var.2
    // fs.writeFileSync('myLog.txt', message + ' ' + new Date().toISOString() + '\n', {flag: 'a+'})   //var.1
    console.log(new Date().toISOString(), message)
})