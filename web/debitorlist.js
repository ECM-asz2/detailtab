window.onload = async function () {
    let config = $('#metaData').data("meta");

    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));

    const lists = [].map.call(document.querySelectorAll('.mdc-list'), function (el) {
        return new mdc.list.MDCList(el);
    });
    const ripples = [].map.call(document.querySelectorAll('.mdc-text-field'), function (el) {
        return new mdc.textField.MDCTextField(el);
    });
    const dataTables = [].map.call(document.querySelectorAll('.mdc-data-table'), function (el) {
        return new mdc.dataTable.MDCDataTable(el);
    });

    let debitors = await getData(config);
    displayDebitors(debitors);
};

function search() {
    //Adapted from https://www.w3schools.com/howto/howto_js_filter_table.asp
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("debitorList");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

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
        let debitors = [];
        for (let i in response.multivalueProperties) {
            if (response.multivalueProperties[i].id === config.partnerIdProperty) {
                for (let key of Object.keys(response.multivalueProperties[i].values)) {
                    let debitor = await buildDebitor(response.multivalueProperties[i].values[key], config, options);
                    if (debitor ==! -1)
                        debitors.push(debitor);
                }
            }
        }
        return debitors;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function buildDebitor(debitorId, config, options) {
    try {
        let debitor = {};
        debitor.debitorId = debitorId;
        options.url = config.host + '/dms/r/' + config.repoId + '/sr/?objectdefinitionids=["' + config.partnerCategory + '"]&properties={"' + config.debitorIdProperty + '":["' + debitorId + '"]}';
        let response = await $.ajax(options);
        if (response.items.length === 0) {
            return -1;
        }
        let debitorResult = response.items[0];
        debitor.debitorLink = config.host + '/dms/r/' + config.repoId + '/o2/' + debitorResult.id + '#details';
        for (let i in debitorResult.displayProperties) {
            if (debitorResult.displayProperties[i].id === config.partnerNameProperty) {
                debitor.debitorName = debitorResult.displayProperties[i].value;
            }
        }
        return debitor;
    } catch {
        return -1;
    }

}

function displayDebitors(debitors) {
    $('.loading').hide();
    if (debitors.length > 0) {
        let tableBody = "";
        for (let i in debitors) {
            tableBody += getTableRowHtml(debitors[i]);
        }
        $('.mdc-data-table__content').html(tableBody);
        $('.mdc-data-table').show();
    } else {
        $('.contentWrapper').prepend('<h6 class="mdc-typography--headline6">Keine Debitoren gefunden.</h4>');
    }
}

function getTableRowHtml(debitor) {
    let tableRow = "";
    tableRow += '<tr class="mdc-data-table__row"><td class="mdc-data-table__cell mdc-data-table__cell">';
    tableRow += debitor.debitorId;
    tableRow += '</td><td class="mdc-data-table__cell"><a href="';
    tableRow += debitor.debitorLink;
    tableRow += '" class="debitorName">'
    tableRow += debitor.debitorName;
    tableRow += '</a></td></tr>';
    return tableRow;
}