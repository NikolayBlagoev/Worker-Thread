var ctx_supervised = document.getElementById("supervised").getContext("2d");
var slider = document.getElementById("wind");
var ctx_unsupervised = document.getElementById("unsupervised").getContext("2d");
var q_matrix = [
    // up down left right
    
       [0, 0,  0,    0], //close left
       [0, 0,  0,    0], //very close left
       [0, 0,  0,    0], //close right
       [0, 0,  0,    0], //very close right
       [0, 0,  0,    0], //no obstacle

]
let exploration_proba = 0.9
let wind = 0;
var curr_state = [0,0]
var ctx_reinforcement = document.getElementById("reinforcement").getContext("2d");
const suprvsd = []
const pl = [ctx_reinforcement.canvas.width/2,ctx_reinforcement.canvas.height]
const unsuprvsd = []
const matrixI3 = math.matrix([[1,0,0], [0,1,0], [0,0,1]]);
console.log(matrixI3)
let cls = 1
function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
      canvas.width = width;
      canvas.height = height;
    }
}

function cls2(){
    cls = -1
    
    document.getElementById("cls1").classList.add("btn-secondary");
    document.getElementById("cls1").classList.remove("btn-primary");

    document.getElementById("cls2").classList.add("btn-primary");
    document.getElementById("cls2").classList.remove("btn-secondary");
    
}
let flagun = false;
function cls1(){
    cls = 1
    document.getElementById("cls1").classList.add("btn-primary");
    document.getElementById("cls1").classList.remove("btn-secondary");

    document.getElementById("cls2").classList.add("btn-secondary");
    document.getElementById("cls2").classList.remove("btn-primary");
}
slider.oninput = function(){
    wind = (parseInt(this.value)-20)/20;
}
document.getElementById("supervised").onclick=  function (e) {
    
    
    let boundRect = ctx_supervised.canvas.getBoundingClientRect();
    let msx = e.clientX - boundRect.left;
    let msy = e.clientY - boundRect.top;
    console.log("click",msx,msy)
    if(suprvsd.length > 20){
        suprvsd.shift();
    }
    suprvsd.push([msx,msy, cls])
}


document.getElementById("unsupervised").onclick=  function (e) {
    
    flagun = true;
    let boundRect = ctx_unsupervised.canvas.getBoundingClientRect();
    let msx = e.clientX - boundRect.left;
    let msy = e.clientY - boundRect.top;
    console.log("click",msx,msy)
    if(unsuprvsd.length > 20){
        unsuprvsd.shift();
    }
    unsuprvsd.push([msx,msy])
}

let k_means = 2;

let centroids = [];
const assignmnets = [];
let left_most = 0;
let iters = 1000;
function reset(){
    q_matrix = [
        // up down left right
        
           [0, 0,  0,    0], //close left
           [0, 0,  0,    0], //very close left
           [0, 0,  0,    0], //close right
           [0, 0,  0,    0], //very close right
           [0, 0,  0,    0], //no obstacle
    
    ]
    exploration_proba = 0.99;
    iters = 1000;
    pl [0]= ctx_reinforcement.canvas.width/2
    pl[1] = ctx_reinforcement.canvas.height;
}
async function render(time) {
    resize(ctx_supervised.canvas)
    ctx_supervised.clearRect(-ctx_supervised.canvas.width/2, - ctx_supervised.canvas.height/2, ctx_supervised.canvas.width*2,  ctx_supervised.canvas.height*2);
    ctx_supervised.fillStyle = "rgb(230,230,230)";
    ctx_supervised.fillRect(0, 0, ctx_supervised.canvas.width, ctx_supervised.canvas.height);
    let lbls = []
    let features = []
    let f1 = false
    let f2 = false
    for(const el in suprvsd){
        // console.log(suprvsd[el])
        ctx_supervised.beginPath();
        ctx_supervised.arc(suprvsd[el][0], suprvsd[el][1], 10, 0, 2 * Math.PI, false);
        ctx_supervised.fillStyle = suprvsd[el][2] == 1 ? "green" : "red";
        lbls.push([suprvsd[el][2]])
        features.push([1,suprvsd[el][0], suprvsd[el][1]])
        ctx_supervised.fill();
        f1 = f1 + (suprvsd[el][2] == 1 ? 1 : 0)
        f2 = f2 + (suprvsd[el][2] != 1 ? 1 : 0)
        
    }
    
    if(f1>1&&f2>1){
        const X = math.matrix(features)
        
        
        const Y = math.matrix(lbls)
        // math.multiply(math.transpose(X), X)
        const sol = math.multiply(math.divide(matrixI3, math.multiply(math.transpose(X), X)), math.multiply(math.transpose(X),Y))
        ctx_supervised.fillStyle = "gray";
        let ix = 0
        while (ix < ctx_supervised.canvas.width){
            ctx_supervised.fillRect(ix, -(ix*sol._data[1][0] + sol._data[0][0])/sol._data[2][0], 2, 2);
            // console.log((ix*sol._data[1][0] + sol._data[0][0])/sol._data[2][0])
            ix+=5
        }

        ix = 0
        while (ix < ctx_supervised.canvas.height){
            ctx_supervised.fillRect(-(ix*sol._data[2][0] + sol._data[0][0])/sol._data[1][0], ix, 2, 2);
            // console.log((ix*sol._data[1][0] + sol._data[0][0])/sol._data[2][0])
            ix+=5
        }
        
        
    }
    resize(ctx_unsupervised.canvas)
    ctx_unsupervised.clearRect(-ctx_unsupervised.canvas.width/2, - ctx_unsupervised.canvas.height/2, ctx_unsupervised.canvas.width*2,  ctx_unsupervised.canvas.height*2);
    ctx_unsupervised.fillStyle = "rgb(230,230,230)";
    ctx_unsupervised.fillRect(0, 0, ctx_unsupervised.canvas.width, ctx_unsupervised.canvas.height);
    let cntr = 0;
    while(cntr< unsuprvsd.length){
        // console.log(suprvsd[el])
        ctx_unsupervised.beginPath();
        ctx_unsupervised.arc(unsuprvsd[cntr][0], unsuprvsd[cntr][1], 10, 0, 2 * Math.PI, false);
        if(unsuprvsd.length < k_means*2){
            ctx_unsupervised.fillStyle = "green";
        }else{
            ctx_unsupervised.fillStyle = assignmnets[cntr] == left_most ? "green" : "red";
            
           
        }
        
        
        ctx_unsupervised.fill();
        cntr ++;
        
    }
    
    if(unsuprvsd.length >= k_means*2 && flagun){
        console.log("tick")
        flagun = false;
        centroids = [];
        let max_v = 50
        let ix = 0;
        
        while(ix < k_means){
            centroids.push([Math.floor(Math.random() * 20) - 10 + ctx_unsupervised.canvas.width/2, Math.floor(Math.random() * 20) - 10 + ctx_unsupervised.canvas.height/2])
            ix+=1
        }
        while(max_v > 0){
            assignmnets.length = 0
            
            for(const el in unsuprvsd){
                let min_el = 0;
                let min_dist =  ctx_unsupervised.canvas.width*ctx_unsupervised.canvas.height;
                ix = 0
                while(ix < centroids.length){
                    let tmpv = Math.sqrt(Math.pow(unsuprvsd[el][0]-centroids[ix][0],2) + Math.pow(unsuprvsd[el][1]-centroids[ix][1],2))
                    if(tmpv < min_dist){
                        min_dist = tmpv
                        min_el = ix
                    }
                    ix ++;
                }
                assignmnets.push(min_el);
            }
            ix = 0
            while(ix < centroids.length){
                let x_tmp = 0;
                let y_tmp = 0;
                let count_tmp = 0;
                let i_tmp = 0;
                while(i_tmp < assignmnets.length){
                    if(assignmnets[i_tmp] == ix){
                        x_tmp += unsuprvsd[i_tmp][0]
                        y_tmp += unsuprvsd[i_tmp][1]
                        count_tmp += 1;
                    }
                    i_tmp++;
                }
                if(count_tmp > 0){
                    centroids[ix][0] = x_tmp/count_tmp;
                    centroids[ix][1] = y_tmp/count_tmp;
                }else{
                    centroids[ix][0] = centroids[(ix+1)%2][0] + 10;
                    centroids[ix][1] = centroids[(ix+1)%2][1] + 10;
                }
                
                ix++;
            }
            max_v--;   
        }
        if(centroids[0][0] > centroids[1][0]){
            left_most = 1;
        }else{
            left_most = 0;
        }
    }
    for(const el in centroids){
        // console.log(suprvsd[el])
        
        ctx_unsupervised.strokeRect(centroids[el][0], centroids[el][1], 5, 5);
        

        
    }

    resize(ctx_reinforcement.canvas)
    ctx_reinforcement.clearRect(-ctx_reinforcement.canvas.width/2, - ctx_reinforcement.canvas.height/2, ctx_reinforcement.canvas.width*2,  ctx_reinforcement.canvas.height*2);
    ctx_reinforcement.fillStyle = "rgb(230,230,230)";
    ctx_reinforcement.fillRect(0, 0, ctx_reinforcement.canvas.width, ctx_reinforcement.canvas.height);
    ctx_reinforcement.beginPath();
    ctx_reinforcement.arc(pl[0], pl[1], 10, 0, 2 * Math.PI, false);
       
    ctx_reinforcement.fillStyle = "gray";
 
        
    if (Math.random() < exploration_proba){
        curr_state[1] = Math.floor(Math.random()*4)
    }else{
        let max_el = 0;
        let max_v = -1;
        for(let i_tmp = 0; i_tmp < q_matrix[curr_state[0]].length; i_tmp++){
            if(q_matrix[curr_state[0]][i_tmp]>max_v){
                max_el = i_tmp;
                max_v = q_matrix[curr_state[0]][i_tmp]
            }
        }
        curr_state[1] = max_el;
    }
    if(curr_state[1]==0){
        pl[1]+= 5;
    }else if(curr_state[1]==1){
        pl[1]-= 5;
    }else if(curr_state[1]==2){
        pl[0]-= 5;
    }else{
        pl[0]+= 5;
    }
    pl[0] += 3*wind;
    let next_state = curr_state[0]
    if(pl[0]-ctx_reinforcement.canvas.width/4 < 40){
        if(pl[0]-ctx_reinforcement.canvas.width/4 < 20){
            next_state = 0
        }else{
            next_state = 1
        }
    }else if(ctx_reinforcement.canvas.width - ctx_reinforcement.canvas.width/4 - pl[0] < 40){
        if(ctx_reinforcement.canvas.width - ctx_reinforcement.canvas.width/4 - pl[0] < 20){
            next_state = 2
        }else{
            next_state = 3
        }
    }else{
        next_state = 4
    }
    let reward =  (1-pl[1]/ctx_reinforcement.canvas.height) - 1.5*(1-Math.min(Math.max(pl[0]-ctx_reinforcement.canvas.width/4, 0), 30)/30) - 1.5*(1-Math.min(Math.max(ctx_reinforcement.canvas.width - ctx_reinforcement.canvas.width/4 - pl[0], 0), 30)/30) ;
    console.log(reward)
    if(pl[1]<=0){
        exploration_proba = Math.max(exploration_proba-0.05, 0.1);
        pl[0] = ctx_reinforcement.canvas.width/2
        pl[1] = ctx_reinforcement.canvas.height-10;
        curr_state[0] = 4
    }else if(pl[1]>ctx_reinforcement.canvas.height + 10 || pl[0]<ctx_reinforcement.canvas.width/4 || pl[0] > ctx_reinforcement.canvas.width -ctx_reinforcement.canvas.width/4){
        exploration_proba = Math.max(exploration_proba-0.05, 0.1);
        q_matrix[curr_state[0]][curr_state[1]] = (1-0.5)*q_matrix[curr_state[0]][curr_state[1]] + 0.5*(-1)
        pl[0] = ctx_reinforcement.canvas.width/2
        pl[1] = ctx_reinforcement.canvas.height-10;
        curr_state[0] = 4
    }
    else{
        let max_v = -1;
        for(el in q_matrix[curr_state[0]]){
            if( q_matrix[curr_state[0]][el] > max_v){
                max_v = q_matrix[curr_state[0]][el]
            }
        }
        q_matrix[curr_state[0]][curr_state[1]] = (1-0.5)*q_matrix[curr_state[0]][curr_state[1]] + 0.5*(reward + 0.1*max_v)
        curr_state[0] = next_state;
    }

    if(iters < 0){
        iters = 500;
        exploration_proba = Math.max(exploration_proba-0.05, 0.1);
        pl[0] = ctx_reinforcement.canvas.width/2
        pl[1] = ctx_reinforcement.canvas.height-10;
        curr_state[0] = 4
    }
    
    
    
    iters -= 1
    ctx_reinforcement.fill();
    ctx_reinforcement.fillRect(ctx_reinforcement.canvas.width/4, 0,  5, ctx_reinforcement.canvas.height);
    ctx_reinforcement.fillRect(ctx_reinforcement.canvas.width - ctx_reinforcement.canvas.width/4, 0,  5, ctx_reinforcement.canvas.height);
    // ctx_reinforcement.fillRect(ctx_reinforcement.canvas.width - 20, 0, 10, ctx_reinforcement.height);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
