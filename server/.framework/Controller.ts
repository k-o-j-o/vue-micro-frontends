import * as fs from 'fs/promises';
import { resolve } from 'path';
import * as express from "express";
import * as _ from 'lodash';
import 'reflect-metadata';

import { ServerState } from '@server';
import { twing } from '@templating';
import { Injectable } from '@Injectable';
import { Constructor } from '@util';
import { Provider } from '@Provider';

const CONTROLLERS_PATH = 'server/controllers';
let SERVER_STATE: ServerState;

@Injectable()
export class Controller {
    protected readonly server: ServerState;
    [i: string]: any;

    constructor(...args: any[]) {
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

    public static async initControllers(server: ServerState) {
        SERVER_STATE = server;

        (await fs.readdir(CONTROLLERS_PATH)).forEach(async (filePath) => {
            const controller = await pluckController(filePath);
            if (controller !== null) {
                const routes = getControllerRoutes(controller);
                const router = initControllerRouter(controller, routes);
                const baseRoute = Reflect.getMetadata(CONTROLLER_METADATA, controller)?.path || filePath.replace(/\..*/, "");

                server.application.use(`/${baseRoute}`, router);
            }
    
        })
    }

    public static define(options: Partial<ControllerOptions>) {
        return <C extends Constructor<Controller>>(ctor: C) => {
            Reflect.defineMetadata(CONTROLLER_METADATA, {}, ctor);
            return ctor;
        }
    }
}

const CONTROLLER_METADATA = Symbol('controller-metadata');

type ControllerOptions = {
    path: string;
}

const _populateOptions = (options: Partial<ControllerOptions>) => ({
    
})

async function pluckController<C extends Constructor<Controller>>(filePath: string): Promise<C> {
    return Object.values(await import(resolve(CONTROLLERS_PATH, filePath)))
        .find((val: any) => Reflect.getMetadata(CONTROLLER_METADATA, val) !== null) as any;
}

function getControllerRoutes<C extends Constructor<Controller>>(controller: C): string[] {
    return Object.getOwnPropertyNames(controller.prototype)
        .filter((name) => name !== 'constructor' && _.isFunction(controller.prototype[name])) as any;
}

function initControllerRouter(ctor: Constructor<Controller>, routes: string[]) {
    const router = express.Router();

    routes.forEach((route) => {
        router.get(`/${route}`, () => {
            //TODO: get instance of controller from provider and call route function
        });
    });

    return router;
}