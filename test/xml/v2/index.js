import apiTree from "../../../src/index.js";
import source from "./source.json" with {type: "json"};
import apiPaths from "./api.json" with {type: "json"};

import execute from "./engine/execution/index.js";

const app = apiTree(source, apiPaths, execute);

console.log("app: ", app);

const data = await app.company.fetch();

console.log("data : ", data?.ENVELOPE?.BODY?.DATA?.COLLECTION);