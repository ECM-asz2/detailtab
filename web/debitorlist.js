window.onload = function () {
    const lists = [].map.call(document.querySelectorAll('.mdc-list'), function (el) {
        return new mdc.list.MDCList(el);
    });
    const ripples = [].map.call(document.querySelectorAll('.mdc-text-field'), function (el) {
        return new mdc.textField.MDCTextField(el);
    });
    const dataTables = [].map.call(document.querySelectorAll('.mdc-data-table'), function (el) {
        return new mdc.dataTable.MDCDataTable(el);
    });
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