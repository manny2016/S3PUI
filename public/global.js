var notificationContainer = $('#notification');
if (notificationContainer.length === 0) {
    notificationContainer = $('<div id="notification"></div>');
    notificationContainer.appendTo($("body"));
}
var notification = notificationContainer.data("kendoNotification");
if (!notification) {
    notification = notificationContainer.kendoNotification({
    }).data("kendoNotification");
}
function showNotification(html, level) {
    notification.showText(html, level)
}
function showNotificationInfo(html) {
    showNotification(html, "info")
}
function showNotificationSuccess(html) {
    showNotification(html, "success")
}
function showNotificationWarning(html) {
    showNotification(html, "warning")
}
function showNotificationError(html) {
    showNotification(html, "error")
}



var confirmContainer = $('#confirm');
if (confirmContainer.length === 0) {
    confirmContainer = $('<div id="confirm"></div>');
    confirmContainer.appendTo($("body"));
}
function confirm(html, onApprove, onDeny) {
    var confirmDialog = confirmContainer.kendoConfirm({
        title: false,
        content: html,
        visible: false,
        messages: {
            okText: "Yes",
            cancel: "No"
        }
    }).data("kendoConfirm");
    confirmDialog.result.done(onApprove || function () { }).fail(onDeny || function () { });
    confirmDialog.open();
}