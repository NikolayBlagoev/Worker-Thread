let expl = document.getElementById("expl")
let news = document.getElementById("news")
let ess = document.getElementById("ess")
let wart = document.getElementById("wart")
let tools = document.getElementById("tools")
let gbook = document.getElementById("gbook")
let abus = document.getElementById("abus")

const url = window.location.pathname;
console.log(url)
if(url == "/explanatory"){
    expl.classList.add("active");

    
}else if(url == "/news"){
    news.classList.add("active");

    
}else if(url == "/essays"){
    ess.classList.add("active");

    
}else if(url == "/webart"){
    wart.classList.add("active");

    
}else if(url == "/tools"){
    tools.classList.add("active");

    
}else if(url == "/guestbook"){
    gbook.classList.add("active");

    
}else if(url == "/aboutus"){
    abus.classList.add("active");

    
}