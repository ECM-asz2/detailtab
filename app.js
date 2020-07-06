const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const tenant = require('./modules/tenant')(process.env.systemBaseUri, process.env.SIGNATURE_SECRET);
const requestId = require('./modules/requestid');

const appName = 'able-detailtab';
const basePath = `/${appName}`;
const assetBasePath = process.env.ASSET_BASE_PATH || `/${appName}/assets`;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(tenant);
app.use(requestId);
logger.token('tenantId', (req) => req.tenantId);
logger.token('requestId', (req) => req.requestId);

const rootRouter = require('./routes/root')();
const contracttypeRouter = require('./routes/contracttype')(assetBasePath);
const contractdocumentsRouter = require('./routes/contractdocuments')(assetBasePath);
const debitorlistRouter = require('./routes/debitorlist')(assetBasePath);

// eslint-disable-next-line max-len
app.use(logger('[ctx@49610 rid=":requestId" tn=":tenantId"][http@49610 method=":method" url=":url" millis=":response-time" sbytes=":res[content-length]" status=":status"] '));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(assetBasePath, express.static(path.join(__dirname, 'web')));

app.use(`${basePath}/`, rootRouter);
app.use(`${basePath}/contracttype`, contracttypeRouter);
app.use(`${basePath}/contractdocuments`, contractdocumentsRouter);
app.use(`${basePath}/debitorlist`, debitorlistRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.error(err.message);

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        requestId: req.requestId,
    });
});

module.exports = app;
