function fakeMail(){
	$.ajax({
	
	url: '/mail-submit',
	
    type: 'POST',
	data: {"mail": $("#mailUser").val()},
    xhrFields: {
        withCredentials: false
    },  
    headers: {

    }, 
    success: function (data) {
		console.log("done")
        $("#sent").css("display", "inline")
    },  
    error: function () {
        console.log('We are sorry but our servers are having an issue right now');
    }
	

});
}