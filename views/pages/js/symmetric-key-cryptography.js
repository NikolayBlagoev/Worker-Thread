const a = 'a'.charCodeAt(0)
const z = 'z'.charCodeAt(0)
const A = 'A'.charCodeAt(0)
const Z = 'Z'.charCodeAt(0)
const modulo = (z-a)+1;

function onClickEncrVign1(){
    
    var out = document.getElementById("vign1_d");
    var vignin = document.getElementById("vign1_e").value.toLowerCase();
    var keys = getKeysVign1();

    if(keys.length==0){
        out.value = "INVALID KEY! IT NEEDS TO BE LATIN CHARACTERS WITH NO SPACES"
        return;
    }
    var k1_vi = document.getElementById("vign1");
    k1_vi.innerHTML = "";
    const tr1 = k1_vi.insertRow();

    var i = 0;
    while(i<vignin.length){
        const td = tr1.insertCell();
        td.appendChild(document.createTextNode(vignin[i]));
        i+=1;
    }
    const tr2 = k1_vi.insertRow();
    i = 0;
    var chr = 0;
    while(i<vignin.length){
        c=vignin.charCodeAt(i);
        if(c>=a && c<=z){
            const td = tr2.insertCell();
            
            td.appendChild(document.createTextNode(String.fromCharCode( keys[chr] + a)));
            chr = (chr + 1) % keys.length;

        }else{
            const td = tr2.insertCell();
            td.appendChild(document.createTextNode(" "));
        }
    //     const td = tr2.insertCell();
    //     td.appendChild(document.createTextNode(String.fromCharCode((i+keys[0])%modulo + a)));
        i+=1;
    }
    out.value = encryptVign(vignin, keys);
    const tr3 = k1_vi.insertRow();

    i = 0;
    while(i<out.value.length){
        const td = tr3.insertCell();
        td.appendChild(document.createTextNode(out.value[i]));
        i+=1;
    }

}

function onClickDecrVign1(){
    
    var out = document.getElementById("vign1_e");
    var vignin = document.getElementById("vign1_d").value.toLowerCase();;
    var keys = getKeysVign1();
    if(keys.length==0){
        out.value = "INVALID KEY! IT NEEDS TO BE LATIN CHARACTERS WITH NO SPACES"
        return;
    }
    var k1_vi = document.getElementById("vign1");
    k1_vi.innerHTML = "";
    const tr1 = k1_vi.insertRow();

    var i = 0;
    while(i<vignin.length){
        const td = tr1.insertCell();
        td.appendChild(document.createTextNode(vignin[i]));
        i+=1;
    }
    const tr2 = k1_vi.insertRow();
    i = 0;
    var chr = 0;
    while(i<vignin.length){
        c=vignin.charCodeAt(i);
        if(c>=a && c<=z){
            const td = tr2.insertCell();
            
            td.appendChild(document.createTextNode(String.fromCharCode( keys[chr] + a)));
            chr = (chr + 1) % keys.length;

        }else{
            const td = tr2.insertCell();
            td.appendChild(document.createTextNode(" "));
        }
    //     const td = tr2.insertCell();
    //     td.appendChild(document.createTextNode(String.fromCharCode((i+keys[0])%modulo + a)));
        i+=1;
    }
    console.log(keys);
    out.value = decryptVign(vignin, keys)
    const tr3 = k1_vi.insertRow();

    i = 0;
    while(i<out.value.length){
        const td = tr3.insertCell();
        td.appendChild(document.createTextNode(out.value[i]));
        i+=1;
    }


}
function getKeysVign1(){
    let keys = [];
    var k1 = document.getElementById("keyVign1").value.toLowerCase();
    
    for(let i = 0; i < k1.length; i++){
	let tmp = k1.charCodeAt(i);
	tmp = tmp - a;
	if(tmp < 0 || tmp > 27) return [];
	keys.push(tmp);
    }
    
    return keys
}

function encryptVign(in_string, key){
    let out = "";
    let key_i = 0;
    for(var i = 0; i<in_string.length; i++){
        c=in_string.charCodeAt(i);
        
        if(c>=a && c<=z){
            
            out+=String.fromCharCode(((c-a+key[key_i])%modulo)+a);
	    key_i = (key_i+1) % key.length;

        }else{
            out+=in_string.charAt(i);
        }
	
    }
    return out;
}

function decryptVign(in_string, key){
    let out = "";
    let key_i = 0;
    for(var i = 0; i<in_string.length; i++){
        c=in_string.charCodeAt(i);
        
        if(c>=a && c<=z){
            
            out+=String.fromCharCode((((c-a-key[key_i])%modulo)+modulo)%modulo+a)
	    key_i = (key_i+1) % key.length;
        }else{
            out+=in_string.charAt(i);
        }
	
    }
    return out;
}





function onClickEncr_transp1(){
    
    var out = document.getElementById("dec_transp_1");
    var a = document.getElementById("enc_transp_1").value;
    var keys = getKeysTransp(false);

    if(keys.length==1){
        out.value = "INVALID KEY! IT NEEDS TO BE LATIN CHARACTERS WITH NO SPACES"
        return;
    }
    
    var k1_vi = document.getElementById("transp");
    k1_vi.innerHTML = "";
    const tr1 = k1_vi.insertRow();
    var i = 0;
    var key_display = [];
    while(i<keys.length){
        key_display.push(0);
        i+=1;
    }
    i = 0;
    while(i<keys.length){
        key_display[keys[i][0]] = i+1;
        i+=1
    }
    i = 0;
    while(i<keys.length){
        const td = tr1.insertCell();
        td.appendChild(document.createTextNode(key_display[i]));
        i+=1;
    }
    console.log(keys)
    i = 0;
    while(i < a.length){
        const tr2 = k1_vi.insertRow();
        var k = 0;
        while(k < keys.length){
            const td = tr2.insertCell();
            if(i < a.length){
                td.appendChild(document.createTextNode(a[i]));
            }else{
                
                td.appendChild(document.createTextNode("█"));
            }
        
            i += 1;
            k += 1;
        }
    }

    out.value = encryptTransp(a, keys)
    

}

function onClickDecr_transp1(){
    
    var out = document.getElementById("enc_transp_1");
    var a = document.getElementById("dec_transp_1").value;
    var keys = getKeysTransp(true);
    if(keys.length==1){
        out.value = "INVALID KEY! IT NEEDS TO BE LATIN CHARACTERS WITH NO SPACES"
        return;
    }
    console.log(keys);
    out.value = decryptTransp(a, keys, getKeysTransp(false))
    


}
function getKeysTransp(flag){
    let keys = [];
    var k1 = document.getElementById("key_transp_1").value;
    
    
    for(var i = 0; i<k1.length; i++){
	let tmp = k1.charCodeAt(i) - a;
	if(tmp < 0 || tmp > 28) return [-1];
	
	keys.push([i, tmp]);
	
    }
    
    keys.sort(function(a, b) {
  	if(a[1] < b[1]){
		return -1;
	}else if(a[1] > b[1]){
		return 1;
	}else if(a[0] > b[0]){
		return 1;
	}else{
		return -1;
	}
    });
    console.log(keys)
    if(flag){

	console.log(keys)
	for(var i = 0; i<keys.length; i++){
		
	
		keys[i][1] = i;
	
    	}
	keys.sort(function(a, b) {
  	if(a[0] < b[0]){
		return -1;
	}else if(a[0] > b[0]){
		return 1;
	}
	return 0;
    	});
	return keys;
    }
    return keys;
}

function encryptTransp(in_string, column_order){
    let out = "";
    

    let rows = Math.ceil(in_string.length / column_order.length);
    console.log(rows);
    for(var i = 0; i < column_order.length; i++){
	for(var y = 0; y < rows && column_order[i][0]+y*column_order.length < in_string.length; y++){
		
		out+=in_string[column_order[i][0]+y*column_order.length];
		
		console.log(column_order[i][0]+y*column_order.length)
	}
    }
    
    return out;
}

function decryptTransp(in_string, column_order, column_order_2){
    let out = "";
    
    console.log(column_order_2)
    let rows = Math.floor(in_string.length / column_order.length);
    let modulo = in_string.length % column_order.length;
    console.log(rows, modulo,in_string.length);
    let minor_mod = 0;
    for(var i =  0 ; i <  column_order.length ; i++){
	column_order[column_order_2[i][0]][0] = minor_mod; 
	if(column_order_2[i][0] < modulo){
		minor_mod++;
		
	}
	console.log(minor_mod,column_order_2[i][0])
	
    }
    for(var i = 0; i < rows +1; i++){
	
	for(var y = 0; y < column_order.length; y++){
		if(i == rows && y >= modulo){
			continue;
		}
		out+=in_string[column_order[y][1]*rows+ column_order[y][0]+i];
		console.log(column_order[y][1]*rows+ column_order[y][0]+i, column_order[y][1], rows, i);
	}
    }
    
    return out;
}

function onClickEncr_2(){
    
    var out = document.getElementById("dec_2");
    var a = document.getElementById("enc_2").value;
    var keys = getKeysTransp2(false);
    var key_vign = getKeysVign2()
    if(keys.length==1){
        out.value = "INVALID KEY! IT NEEDS TO BE LATIN CHARACTERS WITH NO SPACES"
        return;
    }
    
    out.value = encryptTransp(encryptVign(a,key_vign), keys)
    

}

function onClickDecr_2(){
    
    var out = document.getElementById("enc_2");
    var a = document.getElementById("dec_2").value;
    var keys_transp = getKeysTransp2(true);
    var keys_vign = getKeysVign2();
    if( keys_vign.length==1){
        out.value = "INVALID KEY! IT NEEDS TO BE LATIN CHARACTERS WITH NO SPACES"
        return;
    }

    
    out.value =  decryptVign( decryptTransp(a, keys_transp, getKeysTransp2(false)), keys_vign)
    


}

function getKeysVign2(){
    let keys = [];
    var k1 = document.getElementById("key_2").value.toLowerCase();
    
    for(let i = 0; i < k1.length; i++){
	let tmp = k1.charCodeAt(i);
	tmp = tmp - a;
	if(tmp < 0 || tmp > 27) return [];
	keys.push(tmp);
    }
    
    return keys
}

function getKeysTransp2(flag){
    let keys = [];
    var k1 = document.getElementById("key_2").value.toLowerCase();
    
    
    for(var i = 0; i<k1.length; i++){
	let tmp = k1.charCodeAt(i) - a;
	if(tmp < 0 || tmp > 28) return [-1];
	
	keys.push([i, tmp]);
	
    }
    
    keys.sort(function(a, b) {
  	if(a[1] < b[1]){
		return -1;
	}else if(a[1] > b[1]){
		return 1;
	}else if(a[0] > b[0]){
		return 1;
	}else{
		return -1;
	}
    });
    console.log(keys)
    if(flag){

	console.log(keys)
	for(var i = 0; i<keys.length; i++){
		
	
		keys[i][1] = i;
	
    	}
	keys.sort(function(a, b) {
  	if(a[0] < b[0]){
		return -1;
	}else if(a[0] > b[0]){
		return 1;
	}
	return 0;
    	});
	return keys;
    }
    return keys;
}
