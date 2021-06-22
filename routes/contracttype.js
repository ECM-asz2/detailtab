const express = require('express');
const config = require('../global.config');

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'text/html': () => {
                res.render('contracttype', {
                    title: 'Vertragsarten',
                    stylesheet: `${assetBasePath}/contracttype.css`,
                    script: `${assetBasePath}/contracttype.js`,
                    requirescript: `${assetBasePath}/require.js`,
                    body: '/../views/contracttype.hbs',
                    metaData: JSON.stringify(getMetaData(req.systemBaseUri, assetBasePath)),
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};

function getMetaData(host, assetBasePath) {
    const localConfig = config[host];
    localConfig.assetBasePath = assetBasePath;
    return localConfig;
}
