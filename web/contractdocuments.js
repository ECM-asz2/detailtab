/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
let contractDocumentsExecuted = false;

window.onload = async () => {
    installDetailTabListener();

    // mdc is loaded through material cdn
    // eslint-disable-next-line no-undef
    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    [].map.call(document.querySelectorAll('.mdc-list'), (el) => new mdc.list.MDCList(el));
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
            if (!contractDocumentsExecuted) {
                contractDocumentsExecuted = true;
                const documentTypes = await getData(event.data.masterData.internalNumber, config);
                displayDocuments(removeDuplicates(documentTypes));
            }
        });
    });
}

/**
 * Loads all documenttypes available for a contract
 * @param {String} caseNumber Internal case number given by detailTabLibJS
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @returns {Array<String>} List of documenttype names
 */
async function getData(caseNumber, config) {
    try {
        const documentId = await getDocumentId(caseNumber, config);
        const options = {
            headers: {
                Accept: 'application/hal+json',
                'Content-Type': 'application/hal+json',
            },
            url: `${config.host}/dms/r/${config.repoId}/fo/${documentId}/content`,
            method: 'get',
        };

        const response = await $.ajax(options);
        const documents = [];
        response.items.forEach((item) => {
            if (item.mimeType !== 'application/vnd.dvelop.folder.empty' && item.mimeType !== 'application/vnd.dvelop.folder') {
                item.displayProperties.forEach((property) => {
                    if (property.id === config.contractTypeProperty && property.value !== '') {
                        documents.push(property.value);
                    }
                });
            }
        });
        return documents;
    } catch (err) {
        console.error(err);
        return [];
    }
}

/**
 * Removes any duplicates from an array
 * @param {Array<>} arr Array to be shortened
 * @returns {Array<>} Array without duplicates
 */
function removeDuplicates(arr) {
    return Array.from(new Set(arr));
}

/**
 * Displays documents in a table
 * @param {Object} documents Content to be displayed
 */
function displayDocuments(documents) {
    $('.loading').hide();
    if (documents.length > 0) {
        let tableHtml = '';
        documents.forEach((document) => {
            tableHtml += '<tr class="mdc-data-table__row"><td class="mdc-data-table__cell">';
            tableHtml += document.split('Kunde ')[1] || document;
            tableHtml += '</td></tr>';
        });
        $('.mdc-data-table__content').html(tableHtml);
        $('.mdc-data-table').show();
    } else {
        $('.contentWrapper').prepend('<h6 class="mdc-typography--headline6">Keine Vertragsunterlagen gefunden.</h4>');
    }
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
