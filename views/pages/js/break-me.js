

webSocket = new WebSocket(`wss://${location.host}/break-me`);
var ctx = document.querySelector("canvas").getContext("2d");
var prev_time = -1;
var prev_text_time = -1;
var max_t = 0.1;
var charc = 0;
let stt = 0;
var txt_indx = 0;
var txt = ["FINE I WILL LET", "YOU HAVE YOUR KEY"];
var txt2 = ["DID YOU REALLY THINK", "IT WILL BE THIS EASY?"];
let key = "";
let actual_key = "";
let alpha_box = 0.7;
let alpha_change=1;
let key_rgba = 0;
let mouse_y = 0;
let mouse_x = 0;
function sendDataJSON(data){
    if(!data) return;
    console.log("done")
    webSocket.send(JSON.stringify(data));
}
// FROM: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
}
window.onmousedown = (e)=>{
    if(stt<2) return;
    var w = ctx.canvas.width;
    let rect = ctx.canvas.getBoundingClientRect();
    let x = mouse_x - rect.left;
    let y = mouse_y - rect.top;
    
    if((x >= 5*w/8 && x <= 6*w/8) && (y >= w/7+w/15 && y <= w/7+w/15 + w/4)){
        
        window.location.href = `http://${location.host}/room`;
    }else{
        return;
    }
    
}
window.addEventListener('mousemove', (e)=>{
    mouse_y = e.clientY;
    mouse_x = e.clientX;
});

window.addEventListener('keydown',(e)=>{
    if(e.key == "Backspace"){
        key = key.slice(0,-1)
    }else if(e.key == "Enter"){
        
        if(key == actual_key){
            stt = 2;
            document.cookie =`key=${key}`;
            webSocket.send(JSON.stringify({"id": 2, "sess": getCookie("session"), "key": key }))
        }else{
            key = "";
            stt = 40 + stt;
        }
    }else if(e.key.length == 1){
        key += e.key;
    }
    
    
});

webSocket.onmessage = (event) => {
    let res = JSON.parse(event.data.toString());
    if(res.id == 0){
        actual_key = res.key;
        stt = res.st;
        startGame();
    }
};
webSocket.onopen = (event) => {
    webSocket.send(JSON.stringify({"id": 1, "sess": getCookie("session") }))
};

function startGame(){
    if(stt >= 2){
        start_door();
    }else{
        requestAnimationFrame(start_render);
    }
    
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
function start_render(time){
    time *= 0.001;
    
    if(prev_time == -1) prev_time = time;
    
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
    
    if(time - prev_text_time > 2*max_t && txt_indx >= txt.length){
        
        if(alpha_box >= 0.9){
            alpha_change = -1;
        }else if(alpha_box <= 0.6){
            alpha_change = 1;
        }
        alpha_box += alpha_change*(time-prev_time)*0.5;
        alpha_box = Math.min(0.9, Math.max(alpha_box, 0.6))

        
        ctx.fillStyle = `rgba(255,255,255,${alpha_box})`;
        ctx.beginPath();
        ctx.roundRect((w-ctx.measureText(actual_key).width)/2, w/7+w/15, ctx.measureText(actual_key).width, w/15, [40]);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(  key == "" ? "ENTER KEY..." : key, (w-ctx.measureText(actual_key).width)/2 + 2, w/7+w/15 - 5 );
    }
    if(time - prev_text_time > 8*max_t && txt_indx >= txt.length){
        key_rgba += (time-prev_time)*0.5;
        ctx.fillStyle = `rgba(255,255,255,${key_rgba})`;
        ctx.fillText( actual_key, (w-ctx.measureText(actual_key).width)/2, w/3 - 5 );
        if(key_rgba >= 0.5){
            stt = 1;
        }
    }
    prev_time = time;
    if(stt == 0){
        requestAnimationFrame(start_render);
    }else if(stt >= 40){
        startWrong();
    }else{
        start_glitch();
        return;
    }
    
}
function start_glitch(){
    
    requestAnimationFrame(glitch);

}
function glitch(time){
    time *= 0.001;
    
    if(prev_time == -1) prev_time = time;
    
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
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    draw_txt(txt, txt_indx, charc, time, max_t, prev_text_time, w, txt.length, 0, -6);
    ctx.fillStyle = "rgba(0, 0, 255, 0.8)";
    draw_txt(txt, txt_indx, charc, time, max_t, prev_text_time, w, txt.length, 0, 6);
    let dh = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    [txt_indx, charc, prev_text_time, dh] = draw_txt(txt, txt_indx, charc, time, max_t, prev_text_time, w, txt.length, dh, 0);
    
    if(true){
        
        if(alpha_box >= 0.9){
            alpha_change = -1;
        }else if(alpha_box <= 0.6){
            console.log("I am trying to help you! Your key is:", actual_key)
            alpha_change = 1;
        }
        alpha_box += alpha_change*(time-prev_time)*0.5;
        alpha_box = Math.min(0.9, Math.max(alpha_box, 0.6))

        
        ctx.fillStyle = `rgba(255,255,255,${alpha_box})`;
        ctx.beginPath();
        ctx.roundRect((w-ctx.measureText(actual_key).width)/2, w/7+w/15, ctx.measureText(actual_key).width, w/15, [40]);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText( key == "" ? "ENTER KEY..." : key, (w-ctx.measureText(actual_key).width)/2 + 2, w/7+w/15 - 5 );
    }
    
    prev_time = time;
    setTimeout(start_puzzle, 1000); 
  
}
var puzzle_start = prev_time;
function start_puzzle(){
    charc = 0;
    txt_indx = 0;
    prev_text_time = 0;
    puzzle_start = prev_time;
    requestAnimationFrame(puzzle_render);

}
let txts = [["YOU ARE STUCK HERE", "FOREVER!"], ["FOREEEVEERR", "AND EVERRR!"], 
            ["ENJOY THE SILENCE,", "FOOL!"], ["HM! NOT EVEN", "TRYING TO ESCAPE ARE YOU?"],
            ["HAHAHAHA! YOU WON'T", "BE ABLE TO ANYWAYS"], ["VERY WELL THEN!", "ENJOY THIS ROOM!"],
            ["I AM LEAVING NOW", "SEE YOU NEVER!"]]
let txts_idx = 0;
function puzzle_render(time){
    time *= 0.001;
    
    if(prev_time == -1) prev_time = time;
    if(txts_idx < txts.length && time - puzzle_start > 8){
        charc = 0;
        txt_indx = 0;
        prev_text_time = 0;
        puzzle_start = prev_time;

        txt2 = txts[txts_idx++];
         
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
    [txt_indx, charc, prev_text_time, dh] = draw_txt(txt2, txt_indx, charc, time, max_t, prev_text_time, w, txt2.length, dh, 0);
    
    if(true){
        
        if(alpha_box >= 0.9){
            alpha_change = -1;
        }else if(alpha_box <= 0.6){
            console.log("I am trying to help you! Your key is:", actual_key)
            alpha_change = 1;
        }
        alpha_box += alpha_change*(time-prev_time)*0.5;
        alpha_box = Math.min(0.9, Math.max(alpha_box, 0.6))

        
        ctx.fillStyle = `rgba(255,255,255,${alpha_box})`;
        ctx.beginPath();
        ctx.roundRect((w-ctx.measureText(actual_key).width)/2, w/7+w/15, ctx.measureText(actual_key).width, w/15, [40]);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(  key == "" ? "ENTER KEY..." : key, (w-ctx.measureText(actual_key).width)/2 + 2, w/7+w/15 - 5 );
    }
    
    prev_time = time;
    if(stt >= 40){
        startWrong();
    }else  if(stt==2){
        start_door();
    
    }else{
        requestAnimationFrame(puzzle_render);
    }
    
    

}
let txts_wrong = [["WROOOONG!", ""], ["WRONG...", "AGAIN!!"], ["JUST GIVE UP!", ""], ["HAHA!", "NOT EVEN CLOSE"]];
let wrong_idx = -1;
let t_wrong = 0;
function startWrong(){
    wrong_idx += 1
    wrong_idx = wrong_idx % txts_wrong.length;
    t_wrong = prev_time;
    requestAnimationFrame(wrong_render)

}

function wrong_render(time){
    time *= 0.001;
    
    if(prev_time == -1) prev_time = time;
    let txt = txts_wrong[wrong_idx];
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
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    draw_txt(txt, 2, 200, time, max_t, prev_text_time, w, txt.length, 0, -6);
    ctx.fillStyle = "rgba(0, 0, 255, 0.8)";
    draw_txt(txt, 2, 200, time, max_t, prev_text_time, w, txt.length, 0, 6);
    let dh = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    draw_txt(txt, 2, 200, time, max_t, prev_text_time, w, txt.length, dh, 0);
    
    if(true){
        
        if(alpha_box >= 0.9){
            alpha_change = -1;
        }else if(alpha_box <= 0.6){
            console.log("I am trying to help you! Your key is:", actual_key)
            alpha_change = 1;
        }
        alpha_box += alpha_change*(time-prev_time)*0.5;
        alpha_box = Math.min(0.9, Math.max(alpha_box, 0.6))

        
        ctx.fillStyle = `rgba(255,255,255,${alpha_box})`;
        ctx.beginPath();
        ctx.roundRect((w-ctx.measureText(actual_key).width)/2, w/7+w/15, ctx.measureText(actual_key).width, w/15, [40]);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText(  key == "" ? "ENTER KEY..." : key, (w-ctx.measureText(actual_key).width)/2 + 2, w/7+w/15 - 5 );
    }
    
    prev_time = time;
    if(time - t_wrong > 3){
        stt = stt % 10;
        if(stt == 1){
            requestAnimationFrame(puzzle_render); 
        }else{
            requestAnimationFrame(start_render); 
        }
    }else{
        requestAnimationFrame(wrong_render); 
    }
    
  
}

function start_door(){
    
    charc = 0;
    txt_indx = 0;
    prev_text_time = 0;
    puzzle_start = prev_time;
    requestAnimationFrame(door_render);

}

function door_render(time){
    time *= 0.001;
    
    if(prev_time == -1) prev_time = time;
    txt2 = ["A DOOR APPEARS", ""]
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
    [txt_indx, charc, prev_text_time, dh] = draw_txt(txt2, txt_indx, charc, time, max_t, prev_text_time, w, txt2.length, dh, 0);
    ctx.fillStyle = "white";
    // ctx.strokeStyle = "black";
    let rect = ctx.canvas.getBoundingClientRect();
    let x = mouse_x - rect.left;
    let y = mouse_y - rect.top;
    ctx.save();
    
    if((x >= 5*w/8 && x <= 6*w/8) && (y >= w/7+w/15 && y <= w/7+w/15 + w/4)){
        ctx.transform(1, 0.2, 0, 1, 5*w/8,  w/7+w/15);
    }else{
        ctx.transform(1, 0, 0, 1, 5*w/8,  w/7+w/15);
    }
    
    ctx.fillStyle = "white";
    ctx.fillRect(0,  0, w/8, w/4);
    ctx.beginPath();
    ctx.arc(w/8 - w/32,(w/7+ w/8)/2,w/100,0,2*Math.PI);
    ctx.stroke();
    // ctx.transform(1, 1, 1, 1, 0, 0);
    // ctx.fillRect(5*w/8,  w/7+w/15, w/8, w/4);
    ctx.restore()
    
    prev_time = time;
    requestAnimationFrame(door_render)
    
    

}