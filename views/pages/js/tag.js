var tg = ""

$(document).ready(function () {
	tg = document.getElementById("gettag").innerHTML
	load_content();

});
window.onscroll = () => {
	if ($(window).scrollTop() + $(window).height() >= $(document).height() * 9 / 10) {
		load_content();
	}
};
window.ondrag = () => {
	if ($(window).scrollTop() + $(window).height() >= $(document).height() * 9 / 10) {
		load_content();
	}
};
flag = true
prev_incrm = 0
function load_content() {
	if (!flag) return;
	$.ajax({
		url: `/content/${prev_incrm}&${tg}`, success: function (result) {
			console.log(result);
			if (result.length < 10) flag = false;
			prev_incrm += result.length
			result.forEach(el => {

				let tmp_tags = ""
				el.tags.forEach(tg => {
					tmp_tags += `<a href="/tags/${tg}">${tg}</a>, `
				})
				$("#content").append(`
			 <div class="card " id="clickablecard" loc = "${el.link}">
			   <div class="row g-0 d-flex">
					 <div class="col-xs-2 col-md-4">
					   <img src="${el.img}" class="img-fluid rounded-start" alt="..." >
					 </div>
					 <div class="col-xs-10 col-md-8 text-left p-md-4">
					   <div class="card-body text-left">
						 <h6 class="card-title text-left">${el.title}</h6>
						 
						 <p class="text-muted text-left card-text"> ${tmp_tags.slice(0, -2)}</p>
						 
					   </div>
				 </div>
				</div>
			 </div>
			 
			 <hr class="mt-2 mb-2"/>`);


			});
			const divs = document.querySelectorAll('#clickablecard')
			divs.forEach(d => {
				d.addEventListener('click', () => {
					console.log("click ", d.getAttribute("loc"))
					location.href = d.getAttribute("loc");
				});

			});

		}
	});
}