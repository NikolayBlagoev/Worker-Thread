
let flag = true;
document.getElementById("rand_img").src = `imgs/art${Math.floor(Math.random()*4) + 1}.jpeg`
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
	
	
		
		
	$("#view-shower").html(`<p class="text-black ms-3">${result.val}</p>`);
	
	
      
   }});
}