var hash_text = document.getElementById("original-sha256");
var hash_bits = document.getElementById("bits-sha256");
var hash_hex = document.getElementById("hex-sha256");
function int2bin(inp){
    let out = "";
    for(var i = 0; i < 8; i++){
        out = inp%2 + out;
        inp = Math.floor(inp/2);
    }
    return out;
}
hash_text.addEventListener("input", ()=>{
  const utf8 = new TextEncoder().encode(hash_text.value);
  return crypto.subtle.digest('SHA-256', utf8).then((digest) => {
    const digArr = Array.from(new Uint8Array(digest));
    
    hash_hex.value = digArr.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
    hash_bits.value = digArr.map((bytes) => int2bin(bytes)).join('');
    
  });
});


var hmac_text = document.getElementById("original-hmac");
var hmac_bits = document.getElementById("bits-hmac");
var hmac_hex = document.getElementById("hex-hmac");
var hmac_key = document.getElementById("key1");
var key = "";
hmac_key.addEventListener("input", ()=>{
    crypto.subtle.importKey(
        "raw", 
        new TextEncoder().encode(hmac_key.value),
        {
            name: "HMAC",
            hash: {name: "SHA-256"}
        },
        false,
        ["sign", "verify"]
    ).then( key_loc => {
        key = key_loc;
        crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(hmac_text.value)
        ).then(digest => {
            const digArr = Array.from(new Uint8Array(digest));
      
            hmac_hex.value = digArr.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
            hmac_bits.value = digArr.map((bytes) => int2bin(bytes)).join('');
        });
    });
});
hmac_text.addEventListener("input", ()=>{
    crypto.subtle.importKey(
        "raw", 
        new TextEncoder().encode(hmac_key.value),
        {
            name: "HMAC",
            hash: {name: "SHA-256"}
        },
        false,
        ["sign", "verify"]
    ).then( key_loc => {
        key = key_loc;
        crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(hmac_text.value)
        ).then(digest => {
            const digArr = Array.from(new Uint8Array(digest));
      
            hmac_hex.value = digArr.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
            hmac_bits.value = digArr.map((bytes) => int2bin(bytes)).join('');
        });
    });
});