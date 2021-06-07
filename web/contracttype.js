/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const contractStatus = {
    terminated: 3,
    // In notice period = In Kündigungsfrist
    noticed: 2,
    running: 1,
};
let contractTypeExecuted = false;

window.onload = async () => {
    installDetailTabListener();

    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));
    [].map.call(document.querySelectorAll('.mdc-data-table'), (el) => new mdc.dataTable.MDCDataTable(el));
    $('.refresh-icon').on('click', () => {
        location.reload();
    });
};

/**
 * Registers the detail tab for data exchange with the cm-detailtab lib
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 */
function installDetailTabListener() {
    const config = $('#metaData').data('meta');

    require.config({
        paths: {
            detailTabJSLib: `${config.assetBasePath}/lib/detailTabJSLib`,
        },
    });

    requirejs(['detailTabJSLib'], (DetailTabJSLib) => {
        const detailTabConnector = new DetailTabJSLib.DetailTabJSLib();
        detailTabConnector.registerForDataChange(async (event) => {
            if (!contractTypeExecuted) {
                contractTypeExecuted = true;
                try {
                    const documentId = await getDocumentId(event.data.masterData.internalNumber, config);
                    const contractTypes = await getContractTypes(config, documentId);
                    const contract = await getContractStatus(config, documentId);
                    displayContractStatus(contract);
                    displayContractTypes(contractTypes);
                } catch (err) {
                    console.error(err);
                    $('.loading').hide();
                    $('.contractTypeWrapper').show('');
                    $('.contractTypeWrapper').html('<h6 class="mdc-typography--headline6">Es wurden keine Vertragsarten gefunden.</h6>');
                }
            }
        });
    });
}

/**
 * Loads the displayed contract via DMS API
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @param {String} documentId d.3 ID of the document (contract) to be loaded
 * @returns {Object} DMS API object
 */
async function getContract(config, documentId) {
    const options = {
        headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/hal+json',
        },
        url: `${config.host}/dms/r/${config.repoId}/o2/${documentId}`,
        method: 'get',
    };
    return $.ajax(options);
}

/**
 * Generates an object with all contracttypes and information on signature
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @param {String} documentId d.3 ID of the document (contract) to be loaded
 * @returns {Object} object with all contracttypes and information on signature
 */
async function getContractTypes(config, documentId) {
    const contractTypes = [];
    try {
        const contract = await getContract(config, documentId);
        contract.objectProperties.forEach((property) => {
            switch (property.id) {
            case config.aueProperty: contractTypes.push(buildContractTypeObject('Arbeitnehmerüberlassung', property.value)); break;
            case config.dvProperty: contractTypes.push(buildContractTypeObject('Dienstvertrag', property.value)); break;
            case config.wvProperty: contractTypes.push(buildContractTypeObject('Werkvertrag', property.value)); break;
            case config.pvProperty: contractTypes.push(buildContractTypeObject('Personalvermittlung', property.value)); break;
            default: break;
            }
        });
    } catch (err) {
        console.error(err);
    }
    return contractTypes;
}

/**
 * Converts the contract type information from string to a doubled boolean for a contracttype
 * @param {String} title name of the contracttype
 * @param {String} signedField field value which described the contract type and signing
 * @returns {Object<String, Boolean, Boolean>} Contract type informations which are processable
 */
function buildContractTypeObject(title, signedField) {
    const contractTypeObject = {};
    contractTypeObject.title = title;
    if (signedField === 'Ja, unterzeichnet') {
        contractTypeObject.exists = true;
        contractTypeObject.signed = true;
    } else if (signedField === 'Ja, jedoch nicht unterzeichnet') {
        contractTypeObject.exists = true;
        contractTypeObject.signed = false;
    } else if (signedField === 'Nein') {
        contractTypeObject.exists = false;
        contractTypeObject.signed = false;
    } else if (signedField !== '') {
        // Shouldn't happen
        console.error('Unrecognized contract type field ', signedField);
        contractTypeObject.exists = false;
        contractTypeObject.signed = false;
    }
    return contractTypeObject;
}

/**
 * Builds a contract with name and status
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @param {String} documentId d.3 ID of the document (contract) to be loaded
 * @returns {Object<String, Number>} Contract with name and status
 */
async function getContractStatus(config, documentId) {
    let contractBeginn;
    let contractEnd;
    const contract = {};
    const contractResponse = await getContract(config, documentId);
    contractResponse.objectProperties.forEach((property) => {
        if (property.id === config.contractNameProperty) {
            contract.name = property.value;
        } else if (property.id === config.contractStartdateProperty) {
            contractBeginn = property.value;
        } else if (property.id === config.contractEnddateProperty) {
            contractEnd = property.value;
        }
    });
    contract.status = determineContractStatus(contractBeginn, contractEnd);
    return contract;
}

/**
 * Defines the contract status (red/green) depending on the contract dates
 * @param {String} contractBegin Configuration based on the tenant providing URLs and data field IDs
 * @param {String} contractEnd d.3 ID of the document (contract) to be loaded
 * @returns {Number} Status number
 */
function determineContractStatus(contractBegin, contractEnd) {
    if (contractBegin !== '' && typeof contractBegin !== 'undefined') {
        const beginTimestamp = new Date(contractBegin);
        if (contractEnd !== '' && typeof contractEnd !== 'undefined') {
            const endTimestamp = dateParser(contractEnd);
            if (beginTimestamp < Date.now() && endTimestamp > Date.now()) {
                return contractStatus.running;
            }
            return contractStatus.terminated;
        }
        if (beginTimestamp < Date.now()) {
            return contractStatus.running;
        }
        return contractStatus.terminated;
    }
    if (contractEnd !== '' && typeof contractEnd !== 'undefined') {
        const endTimestamp = new Date(contractEnd);
        if (endTimestamp > Date.now()) {
            return contractStatus.running;
        }
        return contractStatus.terminated;
    }
    return contractStatus.terminated;
}

/**
 * Parses a date string to a Date
 * @param {String} dateString Date in DD.MM.YYYY
 * @returns {Date} Parsed date
 */
function dateParser(dateString) {
    const dateArray = dateString.split('.');
    return Date.parse(dateArray.reverse().join('-'));
}

/**
 * Renders the contract with name and status
 * @param {Object <String, Number>} contract Contract to be displayes
 */
function displayContractStatus(contract) {
    if (contract.name) {
        $('.contractTitle').text(contract.name);
    } else {
        $('.contractTitle').text('Fehler: Kein Name hinterlegt.');
    }
    switch (contract.status) {
    case contractStatus.running: $('#contractStatus').css('color', '#2ecc71'); break;
    case contractStatus.noticed: $('#contractStatus').css('color', '#f1c40f'); break;
    case contractStatus.terminated: $('#contractStatus').css('color', '#e74c3c'); break;
    default: $('.contractStatus').hide(); console.error('Unknown contract status.');
    }
}

/**
 * Creates a table for contracttypes
 * @param {Object} contractTypes List of contract types
 */
function displayContractTypes(contractTypes) {
    let tableHtml = '';
    if (contractTypes.length > 0) {
        contractTypes.forEach((contractType) => {
            tableHtml += createTableRow(contractType);
        });
        $('.mdc-data-table__content').html(tableHtml);
        $('.loading').hide();
        $('.contractTypeWrapper').show();
    } else {
        $('.loading').hide();
        $('.contractTypeWrapper').html('<p>Es wurden keine Vertragsarten gefunden.</p>');
    }
}

/**
 * Creates a table row for a contracttype
 * @param {Object} contractType Type to be displayes
 * @returns {String} Valid HTML for a table row
 */
function createTableRow(contractType) {
    let rowHtml = '';
    rowHtml += '<tr class="mdc-data-table__row">';
    rowHtml += createTableCell(contractType.title);
    if (contractType.exists) {
        rowHtml += createTableCell('<span class="material-icons existsIcon">check_circle</span>', 'existsCell');
    } else {
        rowHtml += createTableCell();
    }
    if (contractType.signed) {
        rowHtml += createTableCell('<span class="material-icons signedIcon">check_circle</span>');
    } else {
        rowHtml += createTableCell();
    }
    rowHtml += '</tr>';
    return rowHtml;
}

/**
 * Creates a table cell for content
 * @param {String} content Table row content
 * @param {String} additionalClass HTML Class to be appended to the cell
 * @returns {String} Valid HTML for a table cell
 */
function createTableCell(content = '', additionalClass = '') {
    let cellHtml;
    cellHtml += `<td class="mdc-data-table__cell ${additionalClass}">`;
    cellHtml += content;
    cellHtml += '</td>';
    return cellHtml;
}

/**
 * Returns a document ID for a given case number
 * @param {String} caseNumber Internal case number given by detailTabLibJS
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 */
async function getDocumentId(caseNumber, config) {
    let url;
    let propertyID;
    if (caseNumber.substring(0, 2) === 'VG') {
        propertyID = config.internalCaseNumberProperty;
        url = `${config.host}/dms/r/${config.repoId}/sr/?objectdefinitionids=%5B"XCASE"%5D&properties=%7B"${propertyID}"%3A%5B"${caseNumber}"%5D%7D`;
    } else {
        propertyID = config.internalCustomerContractNumberProperty;
        url = `${config.host}/dms/r/${config.repoId}/sr/?objectdefinitionids=%5B"XRVER"%5D&properties=%7B"${propertyID}"%3A%5B"${caseNumber}"%5D%7D`;
    }

    let documentId = '';
    const options = {
        headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/hal+json',
        },
        url,
        method: 'get',
    };
    const response = await $.ajax(options);
    documentId = response.items[0].id;
    return documentId;
}
