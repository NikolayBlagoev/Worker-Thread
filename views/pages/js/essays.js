const minPerSlide = 3;

$('.carousel .carousel-item').each(function () {

	var next = $(this).next();
	if (!next) {
		next = $(this).siblings(':first');
	}
	next.children(':first-child').clone().appendTo($(this));

	for (var i = 0; i < minPerSlide; i++) { 
		next=next.next(); 
		if (!next.length) { 
			next=$(this).siblings(':first'); 
		} 
		next.children(':first-child').clone().appendTo($(this)); 
	}
}); 