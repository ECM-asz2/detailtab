const contractStatus = {
    terminated: 3,
    noticed: 2, //In notice period = In Kündigungsfrist
    running: 1,
}

window.onload = async function () {
    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    const dataTables = [].map.call(document.querySelectorAll('.mdc-data-table'), function (el) {
        return new mdc.dataTable.MDCDataTable(el);
    });

    let contractTypes = await getContractTypes();
    let contract = await getContractStatus();
    displayContractStatus(contract);
    displayContractTypes(contractTypes);
};

async function getContractTypes() {
    //Possible Types: Arbeitnehmerüberlassung, Dienstvertrag, Werkvertrag, Personalvermittlung
    return [{ title: "Arbeitnehmerüberlassung", exists: true, signed: false }];
}

async function getContractStatus() {
    return { name: "Testvertrag", status: contractStatus.running }
}

function displayContractStatus(contract) {
    if (contract.name) {
        $('h1').text(contract.name);
    } else {
        $('h1').text("Fehler: Kein Name hinterlegt.");
    }
    switch (contract.status) {
        case contractStatus.running: $('.contractStatus').css('color', '#2ecc71'); break;
        case contractStatus.noticed: $('.contractStatus').css('color', '#f1c40f'); break;
        case contractStatus.terminated: $('.contractStatus').css('color', '#e74c3c'); break;
        default: $('.contractStatus').hide();
    }
}

function displayContractTypes(contractTypes) {
    let tableHtml = '',
    if (contractTypes.length > 0) {
        for (let i in contractTypes) {
            tableHtml += createTableRow(contractTypes[i]);
            //title, exists, signed
        }
        $('.mdc-data-table__content').html(tableHtml);
        $('.loading').hide();
        $('.contractTypeWrapper').show();
    } else {
        //TODO: Display that no types are found
    }
}

function createTableRow(contractType) {
    let rowHtml = '';
    rowHtml += '<tr class="mdc-data-table__row">';
    rowHtml += createTableCell(contractType.title);
    if (contractType.exists) {
        rowHtml += createTableCell('<span class="material-icons">check_circle</span>');
    } else {
        rowHtml += createTableCell('');
    }
    rowHtml += '</tr>';
    return rowHtml;
}

function createTableCell(content) {
    let cellHtml;
    cellHtml += '<td class="mdc-data-table__cell">';
    cellHtml += content;
    cellHtml += '</td>';
    return cellHtml;
}