import * as persist from 'node-persist';

(async function() {
    await persist.init({
        dir: 'server/views/.cache'
    });
})();
