const minPerSlide = 3;

var copyChildren = [];
var indx = 0;
$(".carousel-inner").children().each(function (index) {
	copyChildren.push($(this));
	// $(this).removeClass
});
console.log(tmp)

console.log(copyChildren.length)
var actv = $(".carousel-inner").children().eq(0).clone()
var nxt = $(".carousel-inner").children().eq(1).clone()
var aftrnxt = $(".carousel-inner").children().eq(2).clone()
var prv = $(".carousel-inner").children().eq(copyChildren.length - 1).clone()
var bfrprv = $(".carousel-inner").children().eq(copyChildren.length - 2).clone()
$(".carousel-inner").empty()

var tmp = bfrprv
tmp.addClass("before-prev-itm")
$(".carousel-inner").append(tmp)

tmp = prv
tmp.addClass("prev-itm")
$(".carousel-inner").append(tmp)
tmp = actv
tmp.addClass("active")
$(".carousel-inner").append(tmp)

tmp = nxt
tmp.addClass("nxt-itm")
$(".carousel-inner").append(tmp)

tmp = aftrnxt
tmp.addClass("after-nxt-itm")
$(".carousel-inner").append(tmp)

var prvTime = Date.now()

function nextIt() {
	if (Date.now() - prvTime < 600) return
	prvTime = Date.now()
	indx += 1
	indx = indx % copyChildren.length
	$(".carousel-inner").children().eq(1).removeClass("prev-itm")
	$(".carousel-inner").children().eq(1).addClass("before-prev-itm")
	$(".carousel-inner").children().eq(2).removeClass("active")
	$(".carousel-inner").children().eq(2).addClass("prev-itm")
	$(".carousel-inner").children().eq(3).removeClass("nxt-itm")
	$(".carousel-inner").children().eq(3).addClass("active")
	$(".carousel-inner").children().eq(4).removeClass("after-nxt-itm")
	$(".carousel-inner").children().eq(4).addClass("nxt-itm")
	console.log((indx + 2) % copyChildren.length)
	var newit = copyChildren[(indx + 2) % copyChildren.length].clone()
	newit.addClass("after-nxt-itm")
	$(".carousel-inner").append(newit)
	$(".carousel-inner").children().first().remove();

}

function prevIt() {
	if (Date.now() - prvTime < 600) return
	prvTime = Date.now()
	indx -= 1
	if (indx <= 1) {
		indx += copyChildren.length
	}
	$(".carousel-inner").children().eq(0).removeClass("before-prev-itm")
	$(".carousel-inner").children().eq(0).addClass("prev-itm")
	$(".carousel-inner").children().eq(1).removeClass("prev-itm")
	$(".carousel-inner").children().eq(1).addClass("active")
	$(".carousel-inner").children().eq(2).removeClass("active")


	$(".carousel-inner").children().eq(2).addClass("nxt-itm")
	$(".carousel-inner").children().eq(3).removeClass("nxt-itm")
	$(".carousel-inner").children().eq(3).addClass("after-nxt-itm")

	console.log((indx - 2) % copyChildren.length)
	var newit = copyChildren[(indx - 2) % copyChildren.length].clone()
	newit.addClass("before-prev-itm")
	$(".carousel-inner").prepend(newit)
	$(".carousel-inner").children().last().remove();

}
// next.addClass("nxt-itm")
// var afternext = actv.next().next()
// afternext.addClass("after-nxt-itm")
// var prev =$(".carousel-inner").children().slice(-1).clone();
// console.log("//")
// console.log(prev)
// prev.addClass("carousel-item-prev")
// $(".carousel-inner").prepend(prev)

// $('#aiCarousel').on('slide.bs.carousel', function (e) {
// 	console.log(e.direction)
// })


$(document).ready(function () {

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
		url: `/content/${prev_incrm}&Essay`, success: function (result) {
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