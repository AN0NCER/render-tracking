import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const App = new express();
const Port = process.env.Port || 3001;

const links = [];

// Установите EJS в качестве шаблонизатора
App.set("view engine", "ejs");
// Middleware для обработки данных из формы
App.use(bodyParser.urlencoded({ extended: false }));
App.use(bodyParser.json()); // Для обработки JSON-данных, если это необходимо

App.get("/", (req, res) => {
    res.render("index"); // Отображение страницы с формой создания ссылок
});

App.post("/create-link", (req, res) => {
    const { url } = req.body; // Получите URL из тела POST-запроса

    // Добавьте URL в массив ссылок
    links.push({ link: url, showed: false, headers: {}, method: undefined, body: {}, query: undefined, cookies: undefined, ip: undefined, protocol: undefined });

    // Отправьте информацию о созданной ссылке в формате JSON
    res.json({ link: url, showed: false, headers: {}, method: undefined, body: {}, query: undefined, cookies: undefined, ip: undefined, protocol: undefined });
});

App.all("/link/:id", (req, res) => {
    const linkId = req.params.id;
    const linkIndex = links.findIndex(link => link.link === linkId);

    if (linkIndex === -1) {
        return res.status(404).json({ error: "Ссылка не найдена" });
    }

    if (links[linkIndex].showed == true) {
        return res.json(links[linkIndex]);
    }

    console.log(req.headers);

    links[linkIndex].headers = req.headers;
    links[linkIndex].method = req.method;
    links[linkIndex].body = req.body;
    links[linkIndex].query = req.query;
    links[linkIndex].cookies = req.cookies;
    links[linkIndex].ip = req.ip;
    links[linkIndex].protocol = req.protocol;

    links[linkIndex].showed = true;
    return res.render("link", { id: linkId });
})

const server = App.listen(Port, () => { console.log(`App listingen port: ${Port}!`) });

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;