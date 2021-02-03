import 'reflect-metadata';
import { Constructor } from '@util';

export class Provider<T> {
    #ctor: Constructor<T>;
    #instance?: T;

    constructor(ctor: Constructor<T>, instance?: T) {
        this.#ctor = ctor;
        this.#instance = instance;
        Reflect.defineMetadata(PROVIDER_METADATA, this, ctor); //TODO: what to do if provider already exists?
    }

    public getInstance() {
        return this.#instance || (this.#instance = new this.#ctor());
    }

    public static getProvider<T extends Constructor>(ctor: T): Provider<T> {
        let provider = Reflect.getMetadata(PROVIDER_METADATA, ctor);
        
        if (provider === null) {
            provider = new Provider(ctor);
            Reflect.defineMetadata(PROVIDER_METADATA, provider, ctor);
        }

        return provider;
    }
}

const PROVIDER_METADATA = Symbol('provider-metadata');