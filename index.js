var currentdate = new Date(); 

var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


// if (currentdate.getSeconds() == 0) {
  document.getElementById("game").innerHTML = datetime ;
// }