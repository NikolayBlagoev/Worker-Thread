function onClickSign(){
    let out = document.getElementById("hash");
    let sign = document.getElementById("sign");
    let msg = document.getElementById("msg").value;
    const utf8 = new TextEncoder().encode(msg);
    return crypto.subtle.digest('SHA-256', utf8).then((digest) => {
        const digArr = Array.from(new Uint8Array(digest)).slice(-2);
        
        out.value = digArr.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
        sign.value = modular_exp(BigInt(digArr[1]*256 + digArr[0]), d, n)
        
    
    });
    
    // out.value = modular_exp(BigInt(msg), e, n);
}

function onClickVerify(){
    let out = document.getElementById("info");
    out.innerHTML = "";
    let sign = document.getElementById("sign").value;
    let msg = document.getElementById("msg").value;
    const utf8 = new TextEncoder().encode(msg);
    return crypto.subtle.digest('SHA-256', utf8).then((digest) => {
        const digArr = Array.from(new Uint8Array(digest)).slice(-2);
        let hsh = digArr.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
        let sign_check =modular_exp( BigInt(parseInt(sign)), e, n);
        if( modular_exp(BigInt(digArr[1]*256 + digArr[0]),1n,n )== sign_check){
            let a1 = sign_check % 256n;
            let a2 = sign_check / 256n;
            out.innerHTML = `<p>SIGNATURE ACCEPTED!</p><p>Message hash : ${hsh}</p><p>Hash recovered from signature : ${hsh}</p>`
        }else{
            out.innerHTML = `<p>SIGNATURE REJECTED!</p><p>Message hash : ${hsh}</p><p>Hash recovered from signature : ${sign_check.toString(16)}</p>`
            console.log(sign_check, digArr[1]*256 + digArr[0])
        }
        
    
    });
}

var glob_cert = 500
function onClick(){
    var a = document.getElementById("val1").value;
    var out = document.getElementById("output");
    
    if(isNaN(a)||a<0){
        out.innerHTML = "FIRST VALUE NEEDS TO BE AN INTEGER GREATER THAN 0"
        return;
    }
    var b = document.getElementById("val2").value;
    if(isNaN(b)||b<0){
        out.innerHTML = "BOTH VALUES NEED TO BE AN INTEGER GREATER THAN 0"
        return;
    }
    
    const min_max = new BigUint64Array(2);
    min_max[0] = BigInt(a);
    min_max[1] = BigInt(b);
    a=parseInt(a);
    b=parseInt(b);
    if(a>=b){
        out.innerHTML = "FIRST VALUE NEEDS TO BE LESS THAN THE SECOND"
        return;
    }
    
   
    out.innerHTML = get_a_random(min_max);

}
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


var p = BigInt(23);
var q = BigInt(53);
var n = BigInt(1219);
var e = BigInt(3);

var d = BigInt(763);
function genKeys(){
    let oneB = BigInt(1)
    p = get_a_random([BigInt(0),BigInt(20000)]);
    q = get_a_random([BigInt(0),BigInt(20000)]);
    n = p * q;
    let phin = (p - oneB) * (q - oneB);
    e = BigInt(2);
    for(; e < phin; e ++){
        if (gcd(phin, e) == 1) break
    }
    d = gcdExtended(phin, e, 0n, 0n)[1];
    
    if( d < 0n){
        d = phin + d;
    }
}
function onClickGenerate(){
    
    let pel = document.getElementById("p");
    let qel = document.getElementById("q");
    let del = document.getElementById("d");
    let eel = document.getElementById("e");
    let nel = document.getElementById("n");
    genKeys();
    console.log(p,q,d,e,n)
    pel.innerHTML = "Prime 1 : p = " + p;
    qel.innerHTML = "Prime 2 : q = " + q;
    nel.innerHTML = "Modulo : n = " + n;
    del.innerHTML = "PrivKey : d = " + d;
    eel.innerHTML = "PubKey : e = " + e;
}
function onClickEncr(){
    
    
}

function onClickDecr(){
    
    let out = document.getElementById("decr");
    let a = document.getElementById("encr").value;

    let msg = parseInt(a, 10);
    if(isNaN(msg) || msg >= n){
        out.value = "PLEASE INPUT A VALID NUMBER LESS THAN N"
        return
    }
    out.value = modular_exp(BigInt(msg), d, n);
}