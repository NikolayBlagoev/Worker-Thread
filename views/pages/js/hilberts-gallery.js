// const url_loc = window.location.pathname;

// let d= url_loc.split("/");
// console.log(d)
// if(d.length<3){
//     console.log("d")
//     history.pushState({}, "", "hilberts-gallery/fjja");
// }
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sz_canv = 512;
var btn = document.getElementById("regenerate")
var lock = false;
var sess = undefined;
var sess_spr = undefined;
function resize(ctx) {
    // var elm = document.querySelector("canvas");
    // var mn = Math.min(Math.min(elm.height, elm.width), window.innerHeight / 2);
    // if(elm.height != mn || elm.width != mn){
    //     console.log("change", mn, window.innerHeight / 2, elm.height, elm.width);
    //     elm.height = mn;
    //     elm.width = mn;
    //     console.log("after change", mn, window.innerHeight / 2, elm.height, elm.width);
    // }
    
    
    var canvas = ctx.canvas;
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
      canvas.width = width;
      canvas.height = height;
    }
}

function gaussianRandom(mean=0, stdev=1) {
    var u = 0;
    var v = 0;
    while(u == 0) u = Math.random();
    while(v == 0) v = Math.random();
    z =  Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

var img_data = []
var flag = false;
for(var y = 0; y < sz_canv; y++){
    var tmp = []
    for(var x = 0; x < sz_canv; x++){
        tmp.push([Math.random()*255, Math.random()*255, Math.random()*255])
    }
    img_data.push(tmp)
}
rendered = false
flagonce = true
counter_r = 0
var ctx = document.querySelector("canvas").getContext("2d");

const txtd = new TextDecoder('utf8');
function inference_real(){

    console.log(ort)
    console.log("doing...")
    var flt = []
    
    let inputData
    console.log(urlParams.get("screen"))
    if(flagonce && urlParams.get("screen") != null && urlParams.get("screen") != ""){
        
        let a2btmp = atob(urlParams.get("screen").replaceAll('-',"/").replaceAll("_","+"))
        var bytes = new Uint8Array(a2btmp.length);
        for (var ix = 0; ix < a2btmp.length; ix++) {
            bytes[ix] = a2btmp.charCodeAt(ix);
        }

        inputData = new Float32Array(bytes.buffer,0,100)
        console.log(bytes)
    }else{
        for(var i = 0; i < 100; i++){
            gaussianRandom()
            flt.push(gaussianRandom().toFixed(4))
        }
        inputData = Float32Array.from(flt);
    }
    flagonce = false
    tmpz = new Uint8Array(inputData.buffer, inputData.byteOffset, inputData.byteLength)
    // encode(tmpz)
    console.log(tmpz, inputData.byteOffset)
    tmpz = btoa(String.fromCharCode.apply(null, tmpz)).replace(/\//g, '-').replace(/\+/g, "_")
    console.log(tmpz)
    window.history.pushState(null,"","/hilberts-gallery?screen="+tmpz);
    const inputTensor = new ort.Tensor("float32",inputData, [1,100,1,1]);
    sess.run({"input": inputTensor}).then((results)=>{
        console.log("done 1")
        var mn = 1000
        var mx = -1000
        for(var i = 0; i < results.output.data.length; i++){
            if(results.output.data[i]>mx){
                mx = results.output.data[i]
            }
            if(results.output.data[i]<mn){
                mn = results.output.data[i]
            }
            
        }
        
        // console.log(results.output.data)
        for(var i = 0; i < results.output.data.length; i++){
            results.output.data[i] = (results.output.data[i].toFixed(4) - mn)/Math.max(mx-mn, 0.00001)
            
        }
        console.log(mn,mx)
        tmp_arr = []
        for(var y = 0; y < 128; y++){
            
            for(var x = 0; x < 128; x++){
                tmp_arr.push(results.output.data[y*128 + x].toFixed(6))
            }
            // tmp_arr.push(tmp)
        }
        for(var y = 0; y < 128; y++){
            
            for(var x = 0; x < 128; x++){
                tmp_arr.push(results.output.data[128*128 + y*128 + x].toFixed(6))
            }
            // tmp_arr.push(tmp)
        }
        for(var y = 0; y < 128; y++){
            
            for(var x = 0; x < 128; x++){
                tmp_arr.push(results.output.data[2*128*128 + y*128 + x].toFixed(6))
            }
            // tmp_arr.push(tmp)
        }
        const inputSuperRes = new ort.Tensor("float32",Float32Array.from(tmp_arr), [1,3,128,128]); 
        sess_spr.run({"input": inputSuperRes}).then((results2)=>{
           console.log("done 2")
            // for(var y = 0; y < sz_canv; y++){
                
            //     for(var x = 0; x < sz_canv; x++){
            //         if(y< 0 && x < 0){
            //             img_data[y][x][0] = results.output.data[y*128 + x].toFixed(4)*255
            //             img_data[y][x][1] = results.output.data[128*128 + y*128 + x].toFixed(4)*255
            //             img_data[y][x][2] = results.output.data[2*128*128 + y*128 + x].toFixed(4)*255
            //         }else{
            //             img_data[y][x][0] = results2.output.data[y*512 + x].toFixed(4)*255
            //             img_data[y][x][1] = results2.output.data[512*512 + y*512 + x].toFixed(4)*255
            //             img_data[y][x][2] = results2.output.data[2*512*512 + y*512 + x].toFixed(4)*255
            //         }
                    
            //     }
            //     // tmp_arr.push(tmp)
            // }
            img_data = results2.output.data
            flag = true
            
            // console.log(mn,mx)
            // var img_tenspr = results.output.reshape([1,3,128,128]).toDataURL()
            rendered = false
            counter_r = 0
            lock = false;
            btn.value = "REGENERATE"
            btn.classList.remove("btn-secondary");
            btn.classList.add("btn-primary");
        }, (e)=>console.log("ERROR",e));
        
        
        // imgempt.src = img_tenspr
        
    });
}
function run_inf(){
    if(sess == undefined){
        return;
    }
    
    if(lock){
        return;
    }
    flag = false;
    console.log("beginninginference..")
    btn.value = "GENERATING..."
    btn.classList.add("btn-secondary");
    btn.classList.remove("btn-primary");
    lock = true;
    setTimeout(inference_real, 500);
}
ort.InferenceSession.create(`/pan.onnx`).then((res)=>{
    sess_spr = res;
    // run_inf();
}, (e)=>console.log(e))
// 




ort.InferenceSession.create(`/quant_gan_16.onnx`).then((res)=>{
            sess = res;
            run_inf()
                        
}, (e)=>console.log(e))



async function render(time) {
    
    time *= 0.001;
    var w_1 = ctx.canvas.width * ctx.canvas.height;
    resize(ctx);
    if(w_1 != ctx.canvas.width * ctx.canvas.height){
        rendered = false;
    }
    // console.log("here")
    var sz = 1;
    if(!flag){
        // img_data=[]
        sz = 4;
        for(var y = 0; y < sz_canv /sz; y++){
            // var tmp = []
            for(var x = 0; x < sz_canv / sz; x++){
                img_data[y*128+x] = gaussianRandom(1,0.5)/2
                img_data[128*128 + y*128+x] = gaussianRandom(1,0.5)/2
                img_data[2*128*128 +y*128+x] = gaussianRandom(1,0.5)/2

            }
            // img_data.push(tmp)
        }
    }
    
    if(!flag || (flag && !rendered)){
        ctx.clearRect(-ctx.canvas.width/2, - ctx.canvas.height/2, ctx.canvas.width*2,  ctx.canvas.height*2);
        if(flag) rendered = true;
        // console.log(img_data[0*(512/sz)*(512/sz)]*255,img_data[1*(512/sz)*(512/sz)]*255,img_data[2*(512/sz)*(512/sz)]*255)
        for(var y = 0; y < sz_canv / sz; y++){
            for(var x = 0; x < sz_canv / sz; x++){
                ctx.fillStyle = `rgba(${img_data[0*(512/sz)*(512/sz) +y*(512/sz)+x]*255}, ${img_data[1*(512/sz)*(512/sz) +y*(512/sz)+x]*255}, ${img_data[2*(512/sz)*(512/sz) +y*(512/sz)+x]*255}, 1)`;
                ctx.fillRect((ctx.canvas.width/2-(256/sz)*sz)+x*sz, y*sz, sz, sz);
            }
        }
    }
    
    requestAnimationFrame(render);
  }
function copy2clip(){
    window.navigator.clipboard.writeText(window.location.href);
}

function backonce(){
    history.back()
    flagonce = true
    run_inf()
}
requestAnimationFrame(render);