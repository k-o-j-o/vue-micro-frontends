import 'reflect-metadata';
import { Injectable } from '@Injectable';
import { Constructor } from '@util';

@Injectable()
export class Service {
    public static define(options: Partial<ServiceOptions> = {}) {
        options = _populateOptions(options);
        return <S extends Constructor<Service>>(ctor: S) => {
            Reflect.defineMetadata(SERVICE_METADATA, options, ctor);
            return ctor;
        }
    }
}

const SERVICE_METADATA = Symbol('service-metadata');

type ServiceOptions = {

}

const _populateOptions = (options: Partial<ServiceOptions>): ServiceOptions => ({

})