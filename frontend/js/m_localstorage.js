define([], function () {
    var LS = {
        insertData: function (curModel, curAction) {
            var timeMark = new Date().getTime();  //for unique
            localStorage.setItem(timeMark + '%' + curAction, JSON.stringify(curModel))
        },
        updateData: function () {
            console.log('update old');
        }
    }
    return LS;
});
