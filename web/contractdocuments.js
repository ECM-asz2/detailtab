/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
window.onload = async () => {
    const config = $('#metaData').data('meta');

    // mdc is loaded through material cdn
    // eslint-disable-next-line no-undef
    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    [].map.call(document.querySelectorAll('.mdc-list'), (el) => new mdc.list.MDCList(el));
    [].map.call(document.querySelectorAll('.mdc-data-table'), (el) => new mdc.dataTable.MDCDataTable(el));

    $('.refresh-icon').on('click', () => {
        location.reload();
    });

    const documentTypes = await getData(config);
    displayDocuments(removeDuplicates(documentTypes));
};

/**
 * Loads all documenttypes available for a contract
 * @param {Object} config Configuration based on the tenant providing URLs and data field IDs
 * @returns {Array<String>} List of documenttype names
 */
async function getData(config) {
    const documentId = getDocumentId(config);
    const options = {
        headers: {
            Accept: 'application/hal+json',
            'Content-Type': 'application/hal+json',
        },
        url: `${config.host}/dms/r/${config.repoId}/fo/${documentId}/content`,
        method: 'get',
    };
    try {
        const response = await $.ajax(options);
        const documents = [];
        response.items.forEach((item) => {
            if (item.mimeType !== 'application/vnd.dvelop.folder.empty' && item.mimeType !== 'application/vnd.dvelop.folder') {
                item.displayProperties.forEach((property) => {
                    if (property.id === '38' && property.value !== '') {
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
            tableHtml += document.split('Kunde ')[1];
            tableHtml += '</td></tr>';
        });
        $('.mdc-data-table__content').html(tableHtml);
        $('.mdc-data-table').show();
    } else {
        $('.contentWrapper').prepend('<h6 class="mdc-typography--headline6">Keine Vertragsunterlagen gefunden.</h4>');
    }
}

function getDocumentId(config) {
    let documentId = '';
    const regEx = new RegExp(config.regEx);
    const iframes = Array.prototype.slice.call(window.top.document.getElementsByTagName('iframe'));
    iframes.forEach((iframe) => {
        if (iframe.src.match(regEx)) {
            // eslint-disable-next-line prefer-destructuring
            documentId = iframe.src.match(regEx)[0];
        }
    });
    return documentId;
}
