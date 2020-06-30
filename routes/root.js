const express = require('express');

module.exports = () => {
    const router = express.Router();
    router.get('/', (req, res) => {
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'application/hal+json': () => {
                res.send({});
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};
