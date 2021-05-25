/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
let debitorListExecuted = false;

window.onload = async () => {
    try {
        installDetailTabListener();
    } catch (err) {
        console.error(error);
        $('.loading').hide();
        $('.contentWrapper').prepend('<h6 class="mdc-typography--headline6">Keine Debitoren gefunden.</h4>');
    }

    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    [].map.call(document.querySelectorAll('.mdc-list'), (el) => new mdc.list.MDCList(el));
    [].map.call(document.querySelectorAll('.mdc-text-field'), (el) => new mdc.textField.MDCTextField(el));
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
            if (!debitorListExecuted) {
                debitorListExecuted = true;
                const debitors = await getData(event.data.masterData.internalNumber, config);
                displayDebitors(debitors);
            }
        });
    });
}

/**
 * Searches the debitor table on every key pressed
 */
// eslint-disable-next-line no-unused-vars
function search() {
    // Adapted from https://www.w3schools.com/howto/howto_js_filter_table.asp
    const input = document.getElementById('search');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('debitorList');
    const tr = table.getElementsByTagName('tr');

    for (i = 0; i < tr.length; i += 1) {
        // eslint-disable-next-line prefer-destructuring
        td = tr[i].getElementsByTagName('td')[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}
/**
 * Searches for all debitors related to one contract
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @returns {Object} list of debitors
 */
async function getData(internalCaseNumber, config) {
    try {
        const documentId = await getDocumentId(internalCaseNumber, config);
        const options = {
            headers: {
                Accept: 'application/hal+json',
                'Content-Type': 'application/hal+json',
            },
            url: `${config.host}/dms/r/${config.repoId}/o2/${documentId}`,
            method: 'get',
        };
        const response = await $.ajax(options);
        const promises = [];
        response.multivalueProperties.forEach((property) => {
            if (property.values && property.id === config.partnerIdProperty) {
                Object.keys(property.values).forEach((key) => {
                    promises.push(buildDebitor(property.values[key], config, options));
                });
            }
        });
        const debitors = await Promise.all(promises);
        return debitors;
    } catch (err) {
        console.error(err);
        return [];
    }
}

/**
 * Searches for a debitor with his ID
 * @param {String} debitorId ABLE-internal ID of a debitor
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @param {Object} options HTTP-config for API call
 * @returns {Object<String, String, String>} debitor object with name, id and link to the file
 */
async function buildDebitor(debitorId, config, options) {
    try {
        const debitor = {};
        const httpOptions = options;
        const searchHost = `${config.host}/dms/r/${config.repoId}/sr/?`;
        debitor.debitorId = debitorId;
        httpOptions.url = `${searchHost}objectdefinitionids=["${config.partnerCategory}"]&properties={"${config.debitorIdProperty}":["${debitorId}"]}`;
        const response = await $.ajax(httpOptions);
        if (response.items.length === 0) {
            return -1;
        }
        const debitorResult = response.items[0];
        debitor.debitorLink = `${config.host}/dms/r/${config.repoId}/o2/${debitorResult.id}#details`;
        debitorResult.displayProperties.forEach((property) => {
            if (property.id === config.partnerNameProperty) {
                debitor.debitorName = property.value;
            }
        });
        return debitor;
    } catch {
        return -1;
    }
}

/**
 * Creates a table for the dynamic rendering of debitors
 * @param {Object} debitors list of found debitors
 */
function displayDebitors(debitors) {
    $('.loading').hide();
    if (debitors.length > 0) {
        let tableBody = '';
        debitors.forEach((debitor) => {
            if (debitor !== -1) {
                tableBody += getTableRowHtml(debitor);
            }
        });
        $('.mdc-data-table__content').html(tableBody);
        $('.mdc-data-table').show();
    } else {
        $('.contentWrapper').prepend('<h6 class="mdc-typography--headline6">Keine Debitoren gefunden.</h4>');
    }
}

/**
 * Creates a new table row for a debitor
 * @param {Object<String, String, String>} debitor debitor of a contract
 * @returns {String} Tablerow to be parsed
 */
function getTableRowHtml(debitor) {
    let tableRow = '';
    tableRow += '<tr class="mdc-data-table__row"><td class="mdc-data-table__cell mdc-data-table__cell">';
    tableRow += debitor.debitorId;
    tableRow += '</td><td class="mdc-data-table__cell"><a target="_blank" href="';
    tableRow += debitor.debitorLink;
    tableRow += '" class="debitorName">';
    tableRow += debitor.debitorName;
    tableRow += '</a></td></tr>';
    return tableRow;
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
