

webSocket = new WebSocket(`wss://${location.host}/room`);
var ctx = document.querySelector("canvas").getContext("2d");
var prev_time = -1;
var prev_text_time = -1;
var max_t = 0.1;
var charc = 0;

var txt_indx = 0;
var txts_idx = 0;
var puzzle_start = 0;
var txts = [["???: Hey!", "You made it"], ["???: I am a prisoner", "like yourself..."], ["???: My name is", "CVE-2016-5195"], 
    ["???: But you can", "call me cow"], ["COW: I am afraid he", "tricked you"], ["COW: I have a key too", "just like yours"],
    ["COW: But it doesn't seem", "to work on the inside"], ["COW: There is nothing here", "that leads outside..."]]


let alpha_change=-1;
let text_rgba = 0;
let mouse_y = 0;
let mouse_x = 0;

// FROM: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
}

window.onmousedown = (e)=>{
    
    var w = ctx.canvas.width;
    let rect = ctx.canvas.getBoundingClientRect();
    let x = mouse_x - rect.left;
    let y = mouse_y - rect.top;
    
    if((x >= w/8 && x <= w/4) && (y >= w/7+w/15 && y <= w/7+w/15 + w/4)){
        alpha_change = 1;
    }else{
        return;
    }
    
}
window.addEventListener('mousemove', (e)=>{
    mouse_y = e.clientY;
    mouse_x = e.clientX;
});




function startGame(){
    

    requestAnimationFrame(start_render);
    
    
}


function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
      canvas.width = width;
      canvas.height = height;
    }
}

function draw_txt(txt_loc, txt_indx, charc, time, max_t, prev_text_time, w, max_idx, dh, offw){
    if(txt_indx < max_idx && time - prev_text_time > max_t){
        charc +=1;
        if(charc > txt_loc[txt_indx].length){
            txt_indx += 1;
            charc = 0;
        }
        prev_text_time = time;
    }
    
    for(var i = 0; i < txt_indx; i++){
        ctx.fillText( txt_loc[i],  (w-ctx.measureText(txt_loc[i]).width)/2 + offw,  dh);
        dh+=w/15;
    }
    if(txt_indx < max_idx){
        ctx.fillText( txt_loc[txt_indx].substring(0,charc), (w-ctx.measureText(txt_loc[txt_indx]).width)/2 + offw, dh );
    }
    return [txt_indx, charc, prev_text_time, dh]
}
var txt = "";
function start_render(time){
    time *= 0.001;
    
    if(prev_time == -1) prev_time = time;
    
    if(txts_idx < txts.length && time - puzzle_start > 8){
        charc = 0;
        txt_indx = 0;
        prev_text_time = 0;
        puzzle_start = prev_time;

        txt = txts[txts_idx++];
         
    }
    resize(ctx.canvas);
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    ctx.clearRect(-w/2, -h/2, w*2, h*2);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.textRendering = "optimizeLegibility";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.font = `${w/15}px pixel`;
    let dh = 0;
    [txt_indx, charc, prev_text_time, dh] = draw_txt(txt, txt_indx, charc, time, max_t, prev_text_time, w, txt.length, dh, 0);
    
    ctx.save();
    
    
    ctx.transform(1, 0, 0, 1, w/8,  w/7+w/15);
    
    
    ctx.fillStyle = "white";
    ctx.fillRect(0,  0, w/8, w/4);
    ctx.beginPath();
    ctx.arc(w/32,(w/7+ w/8)/2,w/100,0,2*Math.PI);
    ctx.stroke();
    // ctx.transform(1, 1, 1, 1, 0, 0);
    // ctx.fillRect(5*w/8,  w/7+w/15, w/8, w/4);
    text_rgba += alpha_change*0.8*(time-prev_time);
    text_rgba = Math.min(Math.max(text_rgba, 0), 1)
    if(text_rgba == 1){
        alpha_change = -1;
    }
    ctx.fillStyle = `rgba(255,255,255,${text_rgba})`;
    ctx.font = `${w/30}px pixel`;
    ctx.fillText( "LOCKED",  w/8 + w/32,  (w/7+ w/8)/2);
    ctx.restore()
    
    prev_time = time;
    
    requestAnimationFrame(start_render);
    
    
}

startGame();

