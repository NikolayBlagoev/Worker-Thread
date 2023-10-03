let cookies = document.cookie.split("counter");
if(cookies.length == 1){
    document.cookie = "counter=1; expires=10 Jan 2093 12:00:00 UTC; path=/";
    
}else{
    count = parseInt(cookies[1].split(";")[0].substring(1))
    count+=1;
    document.cookie = `counter=${count}; expires=10 Jan 2093 12:00:00 UTC; path=/`;
    document.getElementById("cookie-display").innerHTML = `Times Visited: ${count}`
}
