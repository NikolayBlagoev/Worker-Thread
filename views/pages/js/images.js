var ctx = document.querySelector("canvas").getContext("2d");
r = 128
g = 128
b = 128
function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
      canvas.width = width;
      canvas.height = height;
    }
}
function gchng(rv){
    g = Number(rv)
    document.getElementById("glb").innerHTML = rv;
}

function rchng(rv){
    r = Number(rv)
    document.getElementById("rlb").innerHTML = rv;
}

function bchng(rv){
    b = Number(rv)
    document.getElementById("blb").innerHTML = rv;
}
async function render(time) {
    ctx.clearRect(-ctx.canvas.width/2, - ctx.canvas.height/2, ctx.canvas.width*2,  ctx.canvas.height*2);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, ctx.canvas.width,  ctx.canvas.height);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
