const contractStatus = {
    terminated: 3,
    noticed: 2, //In notice period = In Kündigungsfrist
    running: 1,
}

window.onload = async function () {
    let config = $('#metaData').data("meta");

    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    const dataTables = [].map.call(document.querySelectorAll('.mdc-data-table'), function (el) {
        return new mdc.dataTable.MDCDataTable(el);
    });

    let contractTypes = await getContractTypes();
    let contract = await getContractStatus(config);
    displayContractStatus(contract);
    displayContractTypes(contractTypes);
};

async function getContractTypes() {
    //Possible Types: Arbeitnehmerüberlassung, Dienstvertrag, Werkvertrag, Personalvermittlung
    //TODO get Types from d3 Properties
    return [
        {
            title: "Arbeitnehmerüberlassung",
            exists: true,
            signed: false
        },
        {
            title: "Dienstvertrag",
            exists: false,
            signed: false
        },
        {
            title: "Werkvertrag",
            exists: false,
            signed: false
        },
        {
            title: "Personalvermittlung",
            exists: true,
            signed: true
        }
    ];
}

async function getContractStatus(config) {
    let contractBeginn, contractEnd;
    let documentId = top.location.href.split('/')[top.location.href.split('/').length - 1].split('#')[0]; //This is risky, but unavoidable
    let contract = {};
    const options = {
        headers: {
            'Accept': 'application/hal+json',
            'Content-Type': 'application/hal+json',
        },
        url: config.host + '/dms/r/' + config.repoId + '/o2/' + documentId,
        method: 'get'
    }
    let contractResponse = await $.ajax(options);
    for (let i in contractResponse.objectProperties) {
        if (contractResponse.objectProperties[i].id === config.contractNameProperty) {
            contract.name = contractResponse.objectProperties[i].value;
        } else if (contractResponse.objectProperties[i].id === config.contractStartdateProperty) {
            contractBeginn = contractResponse.objectProperties[i].value;
        } else if (contractResponse.objectProperties[i].id === config.contractEnddateProperty) {
            contractEnd = contractResponse.objectProperties[i].value;
        }
    }
    contract.status = determineContractStatus(contractBeginn, contractEnd);
    return contract;
}

function determineContractStatus(contractBegin, contractEnd) {
    if (contractBegin !== '' && typeof contractBegin !== 'undefined') {
        let beginTimestamp = dateParser(contractBegin);
        if (contractEnd !== '' && typeof contractEnd !== 'undefined') {
            let endTimestamp = dateParser(contractEnd);
            if (beginTimestamp < Date.now() && endTimestamp > Date.now()) {
                return contractStatus.running;
            } else {
                return contractStatus.terminated;
            }
        } else {
            if (beginTimestamp < Date.now()) {
                return contractStatus.running;
            } else {
                return contractStatus.terminated;
            }
        }
    } else {
        if (contractEnd !== '' && typeof contractEnd !== 'undefined') {
            let endTimestamp = dateParser(contractEnd);
            if (endTimestamp > Date.now()) {
                return contractStatus.running;
            } else {
                return contractStatus.terminated;
            }
        } else {
            return contractStatus.terminated;
        }
    }
}

function dateParser(dateString) {
    let dateArray = dateString.split('.');
    return Date.parse(dateArray.reverse().join('-'));
}

function displayContractStatus(contract) {
    if (contract.name) {
        $('.contractTitle').text(contract.name);
    } else {
        $('.contractTitle').text("Fehler: Kein Name hinterlegt.");
    }
    switch (contract.status) {
        case contractStatus.running: $('#contractStatus').css('color', '#2ecc71'); break;
        case contractStatus.noticed: $('#contractStatus').css('color', '#f1c40f'); break;
        case contractStatus.terminated: $('#contractStatus').css('color', '#e74c3c'); break;
        default: $('.contractStatus').hide(); console.error("Unknown contract status.")
    }
}

function displayContractTypes(contractTypes) {
    let tableHtml = '';
    if (contractTypes.length > 0) {
        for (let i in contractTypes) {
            tableHtml += createTableRow(contractTypes[i]);
        }
        $('.mdc-data-table__content').html(tableHtml);
        $('.loading').hide();
        $('.contractTypeWrapper').show();
    } else {
        $('.loading').hide();
        $('.contractTypeWrapper').html('<p>Es wurden keine Vertragsarten gefunden.</p>');
    }
}

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

function createTableCell(content = "", additionalClass = "") {
    let cellHtml;
    cellHtml += '<td class="mdc-data-table__cell ' + additionalClass + '">';
    cellHtml += content;
    cellHtml += '</td>';
    return cellHtml;
}