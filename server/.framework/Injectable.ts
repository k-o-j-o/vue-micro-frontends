import _ from 'lodash';
import 'reflect-metadata';
import { Provider } from '@Provider';
import { Constructor } from '@util';

export function Injectable(options: Partial<InjectableOptions> = {}) {
    return <T extends Constructor>(ctor: T) => {
        options = _populateOptions(ctor, options);
        Reflect.defineMetadata(INJECTABLE_METADATA, options, ctor);

        return class extends ctor {
            constructor(...args: any[]) {
                const injectables = Reflect.getMetadata('design:paramtypes', ctor)
                    .map((type: Constructor) => Provider.getProvider(type).getInstance());
                super(...injectables);
            }
        }
    }
}

const INJECTABLE_METADATA = Symbol('injectable-metadata');

type InjectableOptions = {
    provider: Provider<any>;
}
const _populateOptions = (ctor: Constructor, options: Partial<InjectableOptions>): InjectableOptions => ({
    provider: options?.provider || new Provider(ctor)
});