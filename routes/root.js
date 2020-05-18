const express = require('express');

module.exports = function (basePath, version) {
    const router = express.Router();

    router.get('/', function (req, res, next) {
        console.log('TenantId:' + req.tenantId);
        console.log('SystemBaseUri:' + req.systemBaseUri);
        res.format({
            'application/hal+json': function () {
                res.send({});
            },

            'default': function () {
                res.status(406).send('Not Acceptable')
            }
        });
    });
    return router;
};