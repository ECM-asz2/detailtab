const express = require('express');

module.exports = function (assetBasePath) {
    const router = express.Router();

    router.get('/', function (req, res, next) {
        console.log('TenantId:' + req.tenantId);
        console.log('SystemBaseUri:' + req.systemBaseUri);
        res.format({
            'text/html': function () {
                res.render('debitorlist', {
                    title: 'Debitorenliste',
                    stylesheet: `${assetBasePath}/debitorlist.css`,
                    script: `${assetBasePath}/debitorlist.js`,
                    body: '/../views/debitorlist.hbs',
                    data: getTestData()
                });
            },

            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};

//TODO: Use Real data from API
function getTestData() {
    return [
        {
            "debitorName": "Opel Rüsselheim",
            "debitorId": 60423,
            "debitorLink": "https://able-group-dev.d-velop.cloud/dms/r/1a2cde3f-2913-3dc2-4a2e-e623459ac23a/o2/D100145389#preview"
        },
        {
            "debitorName": "John Deere AG",
            "debitorId": 974343,
            "debitorLink": "https://able-group-dev.d-velop.cloud/dms/r/1a2cde3f-2913-3dc2-4a2e-e623459ac23a/o2/D100145389#preview"
        },
        {
            "debitorName": "General Motors",
            "debitorId": 22023,
            "debitorLink": "https://able-group-dev.d-velop.cloud/dms/r/1a2cde3f-2913-3dc2-4a2e-e623459ac23a/o2/D100145389#preview"
        },
        {
            "debitorName": "Mercedes Benz AG",
            "debitorId": 418945,
            "debitorLink": "https://able-group-dev.d-velop.cloud/dms/r/1a2cde3f-2913-3dc2-4a2e-e623459ac23a/o2/D100145389#preview"
        }
    ];
}