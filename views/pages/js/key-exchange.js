var glob_cert = 500
function gcd(a,b){
    
    if(a==0n && b==0n){
        return -1n;
    } else if(a==0n){
        return b;
    } else if(b==0n){
        return a;
    }else if(b==1n||a==1n){
        return 1n;
    }
    else if(a%2n==0&&b%2n==0){
        return 2n*gcd(a>>1n,b>>1n);
    }else if(a%2n==0){
        return gcd(a/2n,b);
    }else if(b%2n==0){
        return gcd(b/2n,a);
    }else{
        if(a>b)return gcd(a-b,a,b)
        return gcd(b-a,a)
    }
}
function gcdExtended(a, b, x, y){
   
    if (a==0n){
        return [0n,1n,b];
    }
 
    
    let res = gcdExtended(b % a, a, x, y);
    
    gcdRes = res[2];
    
    x = res[1] - (b / a) *  res[0];
    y =  res[0];
 
    return [x,y, gcdRes];
}

function modular_exp(a,exp,p){
    if(p<=1) return 0
    out = 1n
    a = a%p
    
    while(exp>0n){
        if(exp%2n==1) out=(out*a)%p;
        exp = exp>>1n;
        a = (a*a)%p;
    }
    return out;
}

function jacobi_symbol(a,p){
    
    if(a==1n || a==0n) return a;
    if(p==1n || p ==0n) return p;
    a = a%p;
    if(a%2n==0){
        if(p%8n==1n||p%8n==7n){
            return jacobi_symbol(a>>1n,p);
        }else{
            return -jacobi_symbol(a>>1n,p);
        }
    }else{
        if(a%4n==3n && p%4n==3n){
            return -jacobi_symbol(p,a)
        }else{
            return jacobi_symbol(p,a)
        }
    }
    
    
}
function certainty(slideAmount) {
    let sliderDiv = document.getElementById("certainty");
    glob_cert = slideAmount;
    sliderDiv.innerHTML = "Iterations: "+slideAmount;
}
function get_a_random(min_max){
    let flag = true;
    if(min_max[1]-min_max[0]<10000){
       //TODO: ADD EXHAUSTIVE SEARCH HERE: 
    }
    
    let diff = min_max[1]-min_max[0];
    let i = 0;
    let max_iter = glob_cert;
    
    
    while(i<10000 && flag){
        i++;
        var bts = new BigUint64Array(max_iter);

        self.crypto.getRandomValues(bts);
        let candidate = bts[0];
        candidate = (candidate%diff)+min_max[0];
        
        
        if(candidate<0n) candidate = -candidate;
        if(candidate%2n==0) candidate= candidate+1n;
        let totient = candidate-1n;
        let fl2 = true;
        for(let i = 1; fl2&&i<max_iter; i++){
            var witness = bts[i]%candidate;
            
            if(witness%2n==0) witness+=1n;
            if(witness==1n)witness = witness*3n;
            if(witness==candidate) witness = candidate/3n;
            if(witness<0n) witness = -witness;
            if(gcd(witness, candidate)!=1){
                fl2 = false;
                console.log(candidate+" is not prime 1 "+witness)
            }else{
                var mdexp = modular_exp(witness,totient, candidate);
                if(mdexp!=1){
                    fl2 = false;
                    console.log(candidate+" is not prime 2 "+witness+" w "+mdexp+" "+totient)
                }else{
                    let out = modular_exp(witness,totient/2n, candidate);
                    let jc = jacobi_symbol(witness,candidate);
                    if(jc==-1n) jc = candidate-1n;
                    
                    if(out!=jc){
                        fl2 = false;
                        console.log(candidate+" is not prime 3 "+out+" "+jc+" w "+witness)
                    }
                }
            }
        }
        if(fl2){
            return candidate;
        }
    }
    
    return "COULDN'T FIND PRIME IN GIVEN RANGE";
    
    
}


var p = 23;
var g = 5;
var sB = 3;
var sA = 4;

var d = 763;
function genKeys(){
    let oneB = BigInt(1)
    p = get_a_random([BigInt(0),BigInt(1000)]);
    
    let ic = Math.floor(Math.random() * (Number(p)-1));
    ic+=1;
    let flg = false;
    while(ic < p){
        let pw = 2
        while(pw < p){
            if(modular_exp(BigInt(ic), BigInt(pw), BigInt(p)) == BigInt(ic)){
                flg = true;
                break;
            }
            pw+=1;
        }
        if(flg){
            flg = false;
            ic+=1;
            ic = ic % Number(p)
        }else{
            break;
        }
    }
    g = ic;
}

function dh(){
    
    let mb = modular_exp(BigInt(g), BigInt(sB), BigInt(p))
    let ma = modular_exp(BigInt(g), BigInt(sA), BigInt(p))
    let k = modular_exp(BigInt(ma), BigInt(sB), BigInt(p))
    document.getElementById("mb1").innerHTML = mb;
    document.getElementById("mb2").innerHTML = mb;
    document.getElementById("mb3").innerHTML = mb;
    document.getElementById("mb4").innerHTML = mb;

    document.getElementById("ma1").innerHTML = ma;
    document.getElementById("ma2").innerHTML = ma;
    document.getElementById("ma3").innerHTML = ma;
    document.getElementById("ma4").innerHTML = ma;

    document.getElementById("k1").innerHTML = k;
    document.getElementById("k2").innerHTML = modular_exp(BigInt(mb), BigInt(sA), BigInt(p));
    
}

function chngd(){
    sB = parseInt(document.getElementById("sb1").value,10);
    sA = parseInt(document.getElementById("sa1").value,10);
    console.log(32)
    if(isNaN(sB) || isNaN(sA)){
        console.log("nan")
        return;
    }
    
    dh()
}
function on_click_gen(){
    
    let pel = document.getElementById("p1");
    let gel = document.getElementById("g1");
    
    genKeys();
    sb = parseInt(document.getElementById("sb1").value,10);
    sa = parseInt(document.getElementById("sa1").value,10);
    
    document.getElementById("p1").innerHTML = p;
    document.getElementById("p2").innerHTML = p;
    document.getElementById("p3").innerHTML = p;
    document.getElementById("g1").innerHTML = g;
    document.getElementById("g2").innerHTML = g;
    document.getElementById("g3").innerHTML = g;
    if(isNaN(sb) || isNaN(sa)){
        return;
    }
    dh();
}


