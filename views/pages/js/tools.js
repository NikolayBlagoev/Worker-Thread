
let flag = true;
$(document).ready(function(){
  
  load_content();

});
$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height())  {
       load_content();
   }
});
function load_content(){
 if(!flag) return;
 $.ajax({url: `/views/cof`, success: function(result){
	console.log(result);
	
	
		
		
	$("#view-shower-c4").html(`<p class="text-black ms-3">65</p>`);
	
	
      
   }});
}