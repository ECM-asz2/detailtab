const express = require('express');
const config = require('../global.config');

module.exports = function (assetBasePath) {
    const router = express.Router();

    router.get('/', function (req, res, next) {
        console.log('TenantId:' + req.tenantId);
        console.log('SystemBaseUri:' + req.systemBaseUri);
        res.format({
            'text/html': function () {
                res.render('contracttype', {
                    title: 'Vertragsarten',
                    stylesheet: `${assetBasePath}/contracttype.css`,
                    script: `${assetBasePath}/contracttype.js`,
                    body: '/../views/contracttype.hbs',
                    metaData: JSON.stringify(getMetaData(req.systemBaseUri))
                });
            },

            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};

function getMetaData(host){
    return config[host];
}