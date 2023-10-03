var ctx = document.querySelector("canvas").getContext("2d");
const particles = [];
var prev_time = -1;
const tile = document.getElementById("tile");
const yellow = document.getElementById("yellow");
const red = document.getElementById("red");
function resize(canvas) {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
      canvas.width = width;
      canvas.height = height;
    }
}

let evals = {};
var msx = 0;
var msy = 0;
var turn = 0;
let board = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
let particle = undefined;
document.querySelector("canvas").addEventListener("mousemove", (e) => {
    let boundRect = ctx.canvas.getBoundingClientRect();
    msx = e.clientX - boundRect.left;
    msy = e.clientY - boundRect.top;
});
let started = false;
let sess = undefined
ort.InferenceSession.create('/c4bot2.onnx').then((res)=> sess = res, (e)=>console.log(e))
function changep2() {
    var selectBox = document.getElementById("p2");
    var selectedValue = selectBox.value;
    console.log(selectedValue)
    if(selectedValue == "human"){
        
        document.getElementById("p2text").style.display = "none";
        
        document.getElementById("pl2range").style.display = "none";
    }else{
        document.getElementById("p2text").style.display = "inline";
        
        document.getElementById("pl2range").style.display = "inline";
    }
}

function changep1() {
    var selectBox = document.getElementById("p1");
    var selectedValue = selectBox.value;
    console.log(selectedValue)
    if(selectedValue == "human"){
        
        document.getElementById("p1text").style.display = "none";
        
        document.getElementById("pl1range").style.display = "none";
    }else{
        document.getElementById("p1text").style.display = "inline";
        
        document.getElementById("pl1range").style.display = "inline";
    }
}
document.querySelector("canvas").onclick=  function (e) {
    if(!started || particle != undefined) return;
    if(players[turn%2]!="human") return;
    let sz = Math.min(ctx.canvas.width / 7, ctx.canvas.height / 7);
    let x = Math.floor((msx) / sz);
    
    let y = make_move(board, x)
    console.log(y, board[y][x], x)
    if(y >= 0){
        particle = {trgtX: x, trgtY: y, x: Math.floor((msx) / sz)*sz, y: 0}
    }
}
function min_eval(count, empties, curr){
    
    if (count >= 4){
        return [40000000 * curr, true]
    } else if(count == 3 && empties == 2){
        return [333 * curr, false]
    }else if(count == 3 && empties == 1){
        return [11 * curr, false];
    }else if( count == 2 && empties == 2){
        return [2 * curr, false]
    }
    return [0, false]
}
function score(board,y,x){
    let count_y = 0;
    let score_sum = 0;
    let curr =  board[y][x]

    if (curr == 0) return [0, false];
        
   
    let i = y;
    let empties = 0;
    while(i < 6 && board[i][x] == curr){
        i+=1
        count_y+=1
    }
    if (count_y >= 4){
            
        return [47000000 * curr, true];
    }else if(count_y == 3){
        score_sum += 11 * curr;
    }
    empties = 0;
    count_y = 0;
    i = x
    while( i < 7 && board[y][i] == curr){
            i+=1
            count_y+=1
    }
    if (i < 7 && board[y][i] == 0) empties += 1;
    i = x-1;
    while (i >= 0 && board[y][i] == curr){
            i-=1
            count_y+=1
    }
    if(i >= 0 && board[y][i] == 0) empties += 1;
    let ret = min_eval(count_y, empties, curr);
    if(ret[1]){
        return [41000000 * curr, true];
    }
    score_sum += ret[0];
        
    empties = 0
    count_y = 0
    i = x
    j = y
    while (i < 7 && j < 6 && board[j][i] == curr){
            i+=1
            j += 1
            count_y+=1
    }
    if (i < 7 && board[y][i] == 0){
            empties += 1;
    }
    i = x-1
    j = y - 1
    while (i >= 0 && j>=0 && board[j][i] == curr){
            i-=1
            j-=1
            count_y+=1
    }
    if (i >= 0 && board[y][i] == 0) empties += 1;
    ret = min_eval(count_y, empties, curr);
    if(ret[1]){
        return [42000000 * curr, true];
    }
    score_sum += ret[0];
    empties = 0
    count_y = 0
    i = x
    j = y
    while (i >= 0 && j < 6 && board[j][i] == curr){
            i-=1
            j += 1
            count_y+=1
    }
    if (i >= 0 &&  board[y][i] == 0) empties += 1;
    i = x+1
    j = y - 1
    while (i < 7 && j>=0 && board[j][i] == curr){
            i+=1
            j-=1
            count_y+=1
    }
    if (i < 7 && board[y][i] == 0) empties += 1;
    ret = min_eval(count_y, empties, curr);
    if(ret[1]){
        return [43000000 * curr, true];
    }
    score_sum += ret[0];
    if (x == 3){
            score_sum+=18*curr
    }else if(x == 2 || x==4){
            score_sum+=9*curr
    }
    
    return [score_sum, false]

}
function make_move(board, x){
    let y = 0;
    for(; y < 6; y ++){
        if(board[y][x] != 0){
            
            break;
        }
    }
    return y-1;
}
let once_flag = true;
let is_won = false;
let players = ["human", "human", 2, 2];
async function start(){
    
    started = true;
    
    board = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
    particle = undefined;
    is_won = false;
    players[0] = document.getElementById("p1").value;
    players[1] = document.getElementById("p2").value;
    players[2] = document.getElementById("pl1range").value;
    evals = {};
    players[3] = document.getElementById("pl2range").value;
    console.log(players[2], players[3])
    if(turn>0){
        turn = 0;
        requestAnimationFrame(render)
    }
}
async function render(time) {
    time *= 0.001;
    evals = {};
    if(prev_time == -1) prev_time = time;
    resize(ctx.canvas);
    let sz = Math.min(ctx.canvas.width / 7, ctx.canvas.height / 7);
    ctx.clearRect(-ctx.canvas.width/2, - ctx.canvas.height/2, ctx.canvas.width*2,  ctx.canvas.height*2);
    ctx.font = `${sz}px serif`;
    if(is_won){
        
        
        ctx.fillText(`Player ${(turn-1) % 2 + 1} won!`, sz/2, sz-4);
        
    }
    if(!is_won && turn==42){
        
        
        ctx.fillText(`IT IS A DRAW!`, sz/2, sz-4);
        
    }
    
    for(var y = 0; y < 6; y ++){
        for(var x = 0; x < 7; x++){
            if(board[y][x] == 0){
                

            }else if(board[y][x] == 1){
                ctx.drawImage(red, (x) * sz, (y+1)*sz, sz, sz );
            }else{
                ctx.drawImage(yellow, (x) * sz, (y+1)*sz, sz, sz );
            }
        }
    }
    for(var y = 0; y < 6; y ++){
        for(var x = 0; x < 7; x++){
            ctx.drawImage(tile, (x) * sz, (y+1)*sz, sz, sz );
            
        }
    }
    if(is_won) return;
    if(started){
        
        let disc = turn % 2 == 0 ? red : yellow;
        if(particle == undefined){
            if(players[turn%2]=="human"){
                ctx.drawImage(disc, Math.floor((msx) / sz)*sz, 0, sz, sz)
            }else if (players[turn%2]=="sma"){
                if(once_flag){
                    
        
                    ctx.fillText(`THINKING...`, sz/2, sz-4);
                    once_flag = false;
                }else{
                    once_flag = true;
                    await sma_decide(board, turn%2 == 0 ? 1 : -1, players[turn%2 + 2] * 2, turn, evaluateSMA);
                }
                
                
            }else if (players[turn%2]=="dla"){
                if(once_flag){
                    
        
                    ctx.fillText(`THINKING...`, sz/2, sz-4);
                    once_flag = false;
                }else{
                    once_flag = true;
                    await sma_decide(board, turn%2 == 0 ? 1 : -1, players[turn%2 + 2] * 2, turn, evalDL);
                }
                
                
            }
        }else{
            ctx.drawImage(disc, particle.x, particle.y, sz, sz);
            particle.y += sz/4;
            if(Math.floor(particle.y / sz) == particle.trgtY+1){
                board[particle.trgtY][particle.trgtX] = turn % 2 == 0 ? 1 : -1;
                is_won = score(board, particle.trgtY,particle.trgtX)[1];
                // console.log(board);
                turn+=1;
                particle = undefined;
            }
        }
    }
    
    
    prev_time = time;
    requestAnimationFrame(render);
  }




function evaluateSMA(board){
    var score_sums = 0;
    for (let y = 0; y < 6; y++){
      for (let x = 0; x < 7; x++){
          
          ret = score(board, y, x)

          if (ret[1]) return ret
          
          score_sums += ret[0]
      }
        
    }
    
    return [score_sums, false]
}   

function board_hash(board){
    let acc1 = 0;
    let acc2 = 0;
    let sm = 1;
    for(let y = 0; y < 6; y++){
        for(let x = 0; x < 7; x++){
            acc1 += board[y][x] == 1 ? sm : 0;
            acc2 += board[y][x] == -1 ? sm : 0;
            sm = sm*2;
            // console.log(y*7 + x, sm)
        }
    }
    // console.log(acc1,acc2,sm)
    return [acc1,acc2]
}
function is_sym(board){
    var i = 1;
    while(i < 4){
        var y = 0;
        while(y < 6){
            if(board[y][3-i] != board[y][3+i]) return false;
            y+=1;
        }
        i+=1;
    }
    return true;
}
async function min_max(board, pl, depth, max_d, turns, alpha, beta, eval_func){
    // console.log(depth);
    // prnt(board);
  if(turns == 42){
    return [0, 0]
  }
  if (depth == max_d){
      var tor = await eval_func(board);
      
      return tor
  }
  var best_choice = 0;
  var best_score = -490000000000*pl;
  var max = 7;
  if(is_sym(board)) max = 4;
  var mult = 1;
  for(let ch = 0; ch < max; ch++){
      var i = 1;
      if(max == 4){
        i = (ch+3)%7;
      }else{
        i = (mult * Math.ceil(ch/2) + 3)%7;
        mult = mult*-1;
      }
    //   var i = (mult * ch+3)%7;
        
      var y_put = make_move(board, i);
      
      if  (y_put >= 0){
          board[y_put][i] = pl;
          if(score(board,y_put,i)[1]){
            board[y_put][i] = 0;
            return [4100000000*pl, i];
          }
        //   console.log(board)
          let ret_hash = board_hash(board);
          
          let tmp = evals[ret_hash[0]] != undefined ? evals[ret_hash[0]][ret_hash[1]] : undefined;
        //   tmp = undefined;
          if(tmp != undefined){
            
            
            ret = tmp[0];
          }else{
            ret = await min_max(board, pl*-1, depth+1, max_d, turns+1, alpha, beta, eval_func)
            ret = ret[0]
          }
          
          if(evals[ret_hash[0]] == undefined){
            evals[ret_hash[0]] = {}
          }
          if(tmp == undefined){
            evals[ret_hash[0]][ret_hash[1]] = [ret, depth]
          }
        //   if(depth == 0){
        //     console.log(ret, board)
        //   }
          if (pl == 1 && ret > best_score){
              best_choice = i 
              best_score = ret
            //   if(depth == 0){
            //     console.log(ret, i)
            //   }
          }else if(pl == -1 && ret < best_score){
              best_choice = i 
              best_score = ret
          }
          if (pl == 1){
              alpha = Math.max(alpha,ret)
              if (beta<alpha){
                 board[y_put][i] = 0;
                  
                 return [ret, i]
              }
          }else{
              beta = Math.min(beta,ret)
              if (beta < alpha){
                board[y_put][i] = 0;
                return [ret,i]
              }
          }
          board[y_put][i] = 0;
      }
  }
  
  return [best_score, best_choice]
}
              


function prnt(board){
    let arr= "";
    for(var y = 0; y < 6; y ++){
        for(var x = 0; x < 7; x++){
            arr += board[y][x];
            
        }
        arr+="\n"
    }
    console.log(arr);
}
async function evalDL(board){
    
    
    let flt = []
    for(var y = 0; y < 6; y++)
        for(var x = 0; x < 7; x++)
            flt.push(board[y][x])
    const inputData = Float32Array.from(flt);
    const inputTensor = new ort.Tensor("float32",inputData, [6,7]);
    
    const results = await sess.run({"input": inputTensor});
    
    const outputData = results.output.data;
    
    if (outputData[2] > outputData[0] && outputData[2] > outputData[1]){
            return [outputData[2], false]
    }else if (outputData[0]> outputData[2] && outputData[0] > outputData[1]){
            return [outputData[0]*-1, false]
    }else if (outputData[1] > outputData[2] && outputData[1] > outputData[0]){
            return [(outputData[1]*-1)/2, false]
    }
    return [0,false]
    
}
async function sma_decide(board, pl, max_d, turns, eval_func){
  let sz = Math.min(ctx.canvas.width / 7, ctx.canvas.height / 7);
//   prnt(board);
  let inp = await min_max(board, pl, 0, max_d, turns,-40000000000, 40000000000, eval_func);
//   prnt(board);
  console.log(max_d, pl, inp[0], inp[1])
  particle = {trgtX: inp[1], trgtY: make_move(board, inp[1]), x: inp[1]*sz, y: 0};
  return inp[1]
}



requestAnimationFrame(render);



  