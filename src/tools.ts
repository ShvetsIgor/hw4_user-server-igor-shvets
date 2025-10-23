import {IncomingMessage} from "node:http";

export async function parsBody<T = any>(req: InstanceType<typeof IncomingMessage>):Promise<T> {

    return new Promise((resolve, reject) => {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();   //Событие будет происходить столько раз, на сколько поделено бади. Как бы делим бади на куски
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error("Bad JSON"));
            }
        })
    })
}