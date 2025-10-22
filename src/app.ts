import {createServer} from "node:http";
import {addUser, getAllUsers, getUser, removeUser, updateUser, User} from "./model/users.js";
import {parsBody} from "./tools.js";

const myServer = createServer(async (req, res) => {
    const {url, method} = req;
//   /api/usersGET - складывается строка
    const path = '/api/users/';
    const id = Number(url!.split('/')[3]);

    if (url === "/api/users" && method === "GET") {
        const users = getAllUsers();
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(users))
        return;
    }
    else if (url?.startsWith(path) && method === "GET") {
        const user = getUser(id);
        if (user) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(user))
        } else {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
        }
        return;
    }
    else if (url === "/api/users" && method === "POST") {
        const body = await parsBody(req);
        const result = addUser(body as User);
        if (result) {
            res.writeHead(201, {"Content-Type": "text/plain"});
            res.end("User added");
        } else {
            res.writeHead(409, {"Content-Type": "text/plain"});
            res.end("User already exists");
        }
        return;
    }
    else if (url?.startsWith(path) && method === "DELETE") {
        const result = removeUser(id);
        if (result) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("User deleted");
        } else {
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
        } else {
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.end("User not found");
        }
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