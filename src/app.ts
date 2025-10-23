import {createServer} from "node:http";
import {addUser, getAllUsers, getUser, removeUser, updateUser, User} from "./model/users.js";
import {parsBody} from "./tools.js";
import {emitter} from "./events/emitter.js";
import {myLogger} from "./events/logger.js";

const myServer = createServer(async (req, res) => {

    myLogger.log('Server received request');
    const {url, method} = req;
//   /api/usersGET - складывается строка
    const path = '/api/users/';
    const id = Number(url!.split('/')[3]);  //address /api/users/1
    // const myUrl = new URL(url!, `http://${req.headers.host}`); //like this - address - /api/users?id=1
    // const params = myUrl.searchParams;
    // console.log(myUrl)

    if (url === "/api/users" && method === "GET") {
        const users = getAllUsers();
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(users))
        myLogger.log('All users response was generated')
        return;
    }

    else if (url?.startsWith(path) && method === "GET") {
        const user = getUser(id);
        if (user) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(user))
        }
        else {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
        }
        return;
    }

    else if (url === "/api/users" && method === "POST") {
        const body = await parsBody(req) as User;
        const result = addUser(body);

        if (result) {
            // emitter.emit('user_added');                                                 //добавляем сюда из эмиттера ЭМИТ с событием
            myLogger.log(`User with id ${body.id} was successfully added`)
            res.writeHead(201, {"Content-Type": "text/plain"});
            res.end("User added");
        }
        else {
            myLogger.log(`User with id ${body.id} already exists`)
            res.writeHead(409, {"Content-Type": "text/plain"});
            res.end(`User ${body.id} already exists`);
        }
        return;
    }

    else if (url?.startsWith(path) && method === "DELETE") {
        const result = removeUser(id);
        if (result) {
            // emitter.emit('user_removed');
            // myLogger.log(`User with id ${id} was successfully removed`)
            myLogger.save(`User with id ${id} was successfully removed`)
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("User deleted");
        }
        else {
            myLogger.log(`User with id ${id} not found`)
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
        }
        return;
    }

    else if (url?.startsWith(path) && method === "PUT") {
        const body = await parsBody(req);
        const { newName } = body;
        const result = updateUser(newName, id);
        if (result) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("User updated");
        }
        else {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
        }
        return;
    }

    else if (url === '/logger' && method === "GET") {
        const allLogs = myLogger.getLogArray();

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(allLogs))
        return;
    }

    else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("Error 404: Not Found");
    }
});

myServer.listen(3055, () => {
    console.log("Server is running on http://localhost:3055");
})