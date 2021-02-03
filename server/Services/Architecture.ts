import { Service } from "@Service";

@Service.define()
export class ArchitectureService extends Service {
    public getApplicationTypes() {
        return applicationTypes;
    }
}

const applicationTypes = [{
    id: 0,
    name: 'Embedded Vue components',
    endpoint: '/Embedded/Index'
}, {
    id: 1,
    name: 'Vue as template',
    endpoint: '/Template/Index'
}, {
    id: 2,
    name: 'Vue islands',
    endpoint: '/Islands/Index'
}];