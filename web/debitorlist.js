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