const express = require('express');
const config = require('../global.config');

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'text/html': () => {
                res.render('debitorlist', {
                    title: 'Debitorenliste',
                    stylesheet: `${assetBasePath}/debitorlist.css`,
                    script: `${assetBasePath}/debitorlist.js`,
                    body: '/../views/debitorlist.hbs',
                    metaData: JSON.stringify(getMetaData(req.systemBaseUri)),
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};

function getMetaData(host) {
    return config[host];
}
