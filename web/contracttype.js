const contractStatus = {
    terminated: 3,
    noticed: 2, //In notice period = In Kündigungsfrist
    running: 1,
}

window.onload = async function () {
    console.log($('.contentWrapper'));

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

async function getContractStatus() {
    return { name: "Testvertrag", status: contractStatus.running }
}

function displayContractStatus(contract) {
    if (contract.name) {
        $('h1').text(contract.name);
    } else {
        $('h1').text("Fehler: Kein Name hinterlegt.");
    }/*
    console.log(contract.status);
    console.log(contractStatus.running);
    switch (contract.status) {
        case contractStatus.running: $('#contractStatus').css('color', '#2ecc71'); $('#contractStatus').show(); console.log($('#contractStatus')); console.error("53"); break;
        case contractStatus.noticed: $('#contractStatus').css('color', '#f1c40f'); console.error("34"); break;
        case contractStatus.terminated: $('#contractStatus').css('color', '#e74c3c'); console.error("2H"); break;
        //default: $('.contractStatus').hide(); console.error("AH");
    }*/
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