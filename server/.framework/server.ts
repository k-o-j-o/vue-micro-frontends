import * as express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as _ from 'lodash';
import { Controller, ControllerConstructor } from '@Controller';

const PORT = 3000;
const app = express();

const SERVER_STATE: ServerState = {
    application: app,
    request: null as any,
    response: null as any
};

app.use('*', (req, res, next) => {
    SERVER_STATE.request = req;
    SERVER_STATE.response = res;
    next();
});

(async function() {
    await Promise.all([
        Controller.initAll(SERVER_STATE)
    ]); 

    app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
})();

export type ServerState = {
    application: express.Application,
    request: express.Request,
    response: express.Response
}