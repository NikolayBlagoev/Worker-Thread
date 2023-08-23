let prevTime = Date.now();
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
 $.ajax({url: `/comments/${prevTime}`, success: function(result){
	console.log(result);
	if(result.length < 10) flag = false;
	result.forEach(el => {
		prevTime = el.time;
		let dateTmp = new Date(el.time);
		$("#comments").append(`<div style="margin-top: 20px;"></div>
			<div class="row .me-5">
                		<div class="col-xs-1 col-md-2"></div>
                		<div class="col-xs-10 col-md-8 bg-white p-md-2 rounded">
					<div class="d-flex flex-start">
             
             				<div class="w-100">
                					<div class="d-flex justify-content-between align-items-center mb-3">
                  					<h6 class="text-dark fw-bold mb-0">
                    						${el.username}
								</h6>
                    					
                 						<p class="mb-0">${dateTmp.toLocaleString("en-US",{
															day: "numeric",
															month: "numeric",
  															year: "numeric"
})}</p>
                					</div>
							<p class="text-dark ms-2 text-wrap text-break">${el.textMessage}</p>
                  					
                
             				</div>
            			</div>
			
		    		</div>
                		<div class="col-xs-1 col-md-2"></div>
            	</div>`);
	
	});
      
   }});
}