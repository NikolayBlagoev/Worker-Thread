// const url_loc = window.location.pathname;

// let d= url_loc.split("/");
// console.log(d)
// if(d.length<3){
//     console.log("d")
//     history.pushState({}, "", "hilberts-gallery/fjja");
// }
var btn = document.getElementById("regenerate")
var lock = false;
var sess = undefined;
function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
      canvas.width = width/2;
      canvas.height = height/2;
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
for(var y = 0; y < 128; y++){
    var tmp = []
    for(var x = 0; x < 128; x++){
        tmp.push([Math.random()*255, Math.random()*255, Math.random()*255])
    }
    img_data.push(tmp)
}

var ctx = document.querySelector("canvas").getContext("2d");
console.log("beginninginference..")

function run_inf(){
    if(sess == undefined){
        return;
    }
    flag = false;

    if(lock){
        return;
    }
    btn.value = "GENERATING..."
    btn.classList.add("btn-secondary");
    btn.classList.remove("btn-primary");
    lock = true;
    console.log(ort)
    console.log("doing...")
    var flt = []
    for(var i = 0; i < 100; i++){
        gaussianRandom()
        flt.push(gaussianRandom().toFixed(4))
    }
    const inputData = Float32Array.from(flt);
    const inputTensor = new ort.Tensor("float32",inputData, [1,100,1,1]);
    sess.run({"input": inputTensor}).then((results)=>{
        
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
        
        console.log(results.output.data)
        for(var i = 0; i < results.output.data.length; i++){
            results.output.data[i] = (results.output.data[i].toFixed(4) - mn)/Math.max(mx-mn, 0.00001)
            
        }
        console.log(mn,mx)
        tmp_arr = []
            
        for(var y = 0; y < 128; y++){
            var tmp = []
            for(var x = 0; x < 128; x++){
                tmp.push([results.output.data[y*128 + x].toFixed(4)*255, results.output.data[128*128 + y*128 + x].toFixed(4)*255, results.output.data[2*128*128 + y*128 + x].toFixed(4)*255])
            }
            tmp_arr.push(tmp)
        }
        flag = true
        img_data = tmp_arr
        // console.log(mn,mx)
        // var img_tenspr = results.output.reshape([1,3,128,128]).toDataURL()
        
        lock = false;
        btn.value = "REGENERATE"
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        // imgempt.src = img_tenspr
        
    });
}
ort.InferenceSession.create(`/quant_gan411.onnx`).then((res)=>{
    sess = res;
    run_inf();
}, (e)=>console.log(e))


async function render(time) {
    time *= 0.001;
    resize(ctx.canvas);
    var sz = 1;
    if(!flag){
        img_data=[]
        for(var y = 0; y < 128; y++){
            var tmp = []
            for(var x = 0; x < 128; x++){
                tmp.push([gaussianRandom(1,0.5)*128, gaussianRandom(1,0.5)*128, gaussianRandom(1,0.5)*128])
            }
            img_data.push(tmp)
        }
    }
    ctx.clearRect(-ctx.canvas.width/2, - ctx.canvas.height/2, ctx.canvas.width*2,  ctx.canvas.height*2);
    for(var y = 0; y < 128; y++){
        for(var x = 0; x < 128; x++){
            ctx.fillStyle = `rgba(${img_data[y][x][0]}, ${img_data[y][x][1]}, ${img_data[y][x][2]}, 1)`;
            ctx.fillRect((ctx.canvas.width/2-64*sz)+x*sz, y*sz, sz, sz);
        }
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);