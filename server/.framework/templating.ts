import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';

const loader = new TwingLoaderFilesystem('server/Views');

export const twing = new TwingEnvironment(loader, {
    'cache': 'server/Views/.cache',
});