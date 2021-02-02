import * as fs from 'fs/promises';
import { resolve } from 'path';
import * as express from "express";
import * as _ from 'lodash';
import { ServerState } from '@server';
import { twing } from '@templating';

const CONTROLLERS_PATH = 'server/controllers';
let SERVER_STATE: ServerState;

export abstract class Controller {
    protected readonly server: ServerState;
    [i: string]: any;

    protected constructor() {
        Object.defineProperty(this, 'server', {
            value: SERVER_STATE
        });
    }

    protected async View(viewModel?: object) {
        const thing = await twing.render(`${SERVER_STATE.request.originalUrl}.html`, viewModel);
        SERVER_STATE.response.send(thing)
    }

    protected Json() {
        
    }

    public static get(ctor: ControllerConstructor): Controller {
        if (!CONTROLLERS.has(ctor)) {
            CONTROLLERS.set(ctor, new ctor());
        }
        return CONTROLLERS.get(ctor) as Controller;
    }

    public static async initAll(server: ServerState) {
        SERVER_STATE = server;

        (await fs.readdir(CONTROLLERS_PATH)).forEach(async (filePath) => {
            const controller = await pluckController(filePath);
            if (controller !== null) {
                const routes = getControllerRoutes(controller);
                const router = initControllerRouter(controller, routes);
                
                server.application.use(`/${filePath.replace(/\..*/, "")}`, router);
            }
    
        })
    }
}

async function pluckController<C extends ControllerConstructor>(filePath: string): Promise<C> {
    return Object.values(await import(resolve(CONTROLLERS_PATH, filePath)))
        .find((val) => Object.getPrototypeOf(val) === Controller) as any;
}

function getControllerRoutes<C extends ControllerConstructor>(controller: C): string[] {
    return Object.getOwnPropertyNames(controller.prototype)
        .filter((name) => name !== 'constructor' && _.isFunction(controller.prototype[name])) as any;
}

function initControllerRouter(controller: ControllerConstructor, routes: string[]) {
    const router = express.Router();

    routes.forEach((route) => {
        router.get(`/${route}`, () => {
            Controller.get(controller)[route]();
        });
    });

    return router;
}

export type ControllerConstructor = new () => Controller;
const CONTROLLERS = new WeakMap<ControllerConstructor, Controller>();
