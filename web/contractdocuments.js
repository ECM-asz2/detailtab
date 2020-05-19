window.onload = async function () {
    let config = $('#metaData').data("meta");

    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    const lists = [].map.call(document.querySelectorAll('.mdc-list'), function (el) {
        return new mdc.list.MDCList(el);
    });
    const dataTables = [].map.call(document.querySelectorAll('.mdc-data-table'), function (el) {
        return new mdc.dataTable.MDCDataTable(el);
    });

    let documents = await getData(config);
    displayDocuments(documents);
};

async function getData(config) {
    let documentId = top.location.href.split('/')[top.location.href.split('/').length - 1].split('#')[0]; //This is risky, but unavoidable
    const options = {
        headers: {
            'Accept': 'application/hal+json',
            'Content-Type': 'application/hal+json',
        },
        url: config.host + '/dms/r/' + config.repoId + '/o2/' + documentId,
        method: 'get'
    }
    try {
        let response = await $.ajax(options);
        let documents = [];
        for (let i in response.multivalueProperties) {
            if (response.multivalueProperties[i].id === config.partnerIdProperty) {
                for (let key of Object.keys(response.multivalueProperties[i].values)) {
                    for (let j in response.multivalueProperties) {
                        if (response.multivalueProperties[j].id === config.partnerRoleProperty && response.multivalueProperties[j].values[key] === "Kunde") {
                            let doc = await getDocumentsForDebitor(response.multivalueProperties[i].values[key], config, options)
                            if (doc == ! -1)
                                documents.push(doc)
                        }
                    }

                }
            }
        }
        return documents;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getDocumentsForDebitor(debitorId, config, options) {
    try {
        let documents = [];
        options.url = config.host + '/dms/r/' + config.repoId + '/sr/?objectdefinitionids=["' + config.customerCategory + '"]&properties={"' + config.customerNumberProperty + '":["' + debitorId + '"]}';
        let searchResults = await $.ajax(options);
        options.url = config.host + '/dms/r/' + config.repoId + '/fo/' + searchResults.items[0].id + '/content';
        let debitorFolder = await $.ajax(options);
        for (let i in debitorFolder.items) {
            if (debitorFolder.items[i].caption === "02 - Kunde Rahmenvereinbarungen" && debitorFolder.items[i].id === "application/vnd.dvelop.folder") {
                options.url = config.host + '/dms/r' + config.repoId + '/fo/' + debitorFolder.items[i].id + '/content';
                let documentsInRegister = await $.ajax(options);
                for (let j in documentsInRegister.items) {
                    for (let k in documentsInRegister[j].displayProperties) {
                        if(documentsInRegister[j].displayProperties[k].id === "130"){
                            let docType = documentsInRegister[j].displayProperties[k].value;
                            if(!documents.includes(docType)){
                                documents.push({name: docType});
                            }
                            //TODO: Check if already in array
                            //Push it into
                        }
                    }
                }
            }
        }
        if (documents.length === 0) {
            return -1
        } else {
            return documents;
        }
    } catch {
        console.log(error);
        return -1;
    }
    //Kundeakte zur debitorID holen
    // Alle Doc in Register02 holen
    //Alle Doctypen sammeln
    //Als Array(?) zurückgeben
}

function displayDocuments(documents) {
    $('.loading').hide();
    if (documents.length > 0) {
        let tableHtml = "";
        for (let i in documents) {
            tableHtml += '<tr class="mdc-data-table__row"><td class="mdc-data-table__cell">'
            tableHtml += documents[i].name;
            tableHtml += '</td></tr>';
        }
        $('.mdc-data-table__content').html(tableHtml);
        $('.mdc-data-table').show();
    } else {
        $('.contentWrapper').prepend('<h6 class="mdc-typography--headline6">Keine Vertragsunterlagen gefunden.</h4>');
    }
}