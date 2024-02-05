const fs = require('fs');
const path = require('path');
const readline = require('node:readline');


function load_db(tp_lvl = "articles_db/metadata"){
    console.log("reading...")
    ret = {};
    files = fs.readdirSync(tp_lvl)
    
    
    files.forEach(function (file, _) {
          
        var jspth = path.join(tp_lvl, file);
        data = fs.readFileSync(jspth, "utf8")
        ret[file.slice(0, -5)] = JSON.parse(data)
           
    
    });
    
    return ret
    
}

module.exports = {load_db}