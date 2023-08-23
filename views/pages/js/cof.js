

var ctx = document.querySelector("canvas").getContext("2d");
var doc = document.documentElement;
const particles = [];

var prev_time = -1;
var scrollY = 0;
var footstepsY = [2300,3600];
const snowflake = document.getElementById("snowflake");
const blank = document.getElementById("blank");
const robot = document.getElementById("robot");
var body = document.body;
var html = document.documentElement;
var h_max = 12000;
function gen_part(w, h){
	if(scrollY>h_max/5){
                let locx = 0;
		if(Math.random() > 0.5){
			locx = ctx.canvas.width+100;
		}
		let tmp = (h_max - scrollY)/(h_max-h_max/5);
		if(Math.random() < tmp){
			return {x: locx - Math.floor(Math.random() * 50), y: Math.floor(Math.random() * ctx.canvas.height), ax: Math.random(), vx: 10-Math.floor(Math.random() * 20), src: robot, vy: 10-Math.floor(Math.random() * 20), ay: Math.random(), maxX: 10, maxY: 10}
		}
		
		return {x: w/2, y: h/2, ax: 0, vx: 0, src: blank, vy: 20, ay: 0, maxX: 10, maxY: 20}
	}else if(scrollY>h_max/10 + h_max/20){
		return {x: w/2, y: h/2, ax: 0, vx: 0, src: blank, vy: 20, ay: 0, maxX: 10, maxY: 20}
	}else{
		return {x: Math.floor(Math.random() * ctx.canvas.clientWidth), y: -Math.floor(Math.random() * 800), ax: 5, vx: 10-Math.floor(Math.random() * 20), src: snowflake, vy: (Math.random() * 20) + 10, ay: 0, maxX: 10, maxY: 10};
	}
  return {x: w/2, y: h/2, ax: 0, vx: 0, src: blank, vy: 20, ay: 0, maxX: 10, maxY: 20};
}
for(var i = 0; i < 50; i++){
	particles.push(gen_part(0,0));
}

function playFootsteps(){
  footstepsY[0] = scrollY;
  footstepsY[1] = footstepsY[0] + h_max/10;
  console.log(footstepsY);
  footsteps.volume = 0.5;
  footsteps.play();
}
var footsteps = document.getElementById("footsteps");
footsteps.onended = function() {
   if(scrollY >= footstepsY[0] && scrollY <=  footstepsY[1]){
	  footsteps.play();
   }
};
footsteps.volume = 0;

function resize(canvas) {
  h_max = Math.max( body.scrollHeight, body.offsetHeight, 
    html.clientHeight, html.scrollHeight, html.offsetHeight );
  footstepsY[1] = footstepsY[0] + h_max/10;
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;
  if (width != canvas.width || height != canvas.height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function render(time) {
  time *= 0.001;
  
  if(prev_time == -1) prev_time = time;
  resize(ctx.canvas);
  ctx.save();
  var w = ctx.canvas.width;
  var h = ctx.canvas.height;
  var hw = w / 2;
  var hh = h / 2;
  ctx.clearRect(-w/2, -h/2, w*2, h*2);
  
  for(var i = 0; i < particles.length; i++){
   ctx.drawImage(particles[i].src, particles[i].x, particles[i].y);
   
   particles[i].y +=  (time-prev_time)* particles[i].vy;
   particles[i].vx += (time-prev_time)* particles[i].ax;
   particles[i].vy += (time-prev_time)* particles[i].ay;
   particles[i].x += (time-prev_time)* particles[i].vx;
   if(particles[i].vx > particles[i].maxX|| particles[i].vx <-particles[i].maxX) particles[i].ax = -particles[i].ax;
   if(particles[i].vy > particles[i].maxY|| particles[i].vy <-particles[i].maxY) particles[i].ay = -particles[i].ay;
   if(particles[i].y > h+20 || particles[i].x > w+300 || particles[i].x < -300){
	      particles.splice(i, 1);
	      i--;
        particles.push(gen_part(w,h));
   }
  
   
  }
  prev_time = time;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);


document.addEventListener("scroll", (event) => {
  
  scrollY = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  // if(scrollY >= footstepsY[0] && scrollY <=  footstepsY[1]){
	//   footsteps.play();
  //  }
  // console.log(scrollY);
});