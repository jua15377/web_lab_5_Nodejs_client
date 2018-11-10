const io = require("socket.io-client");
var oldMsjArray = []
var newMsjArray = []
const ulMsj = document.querySelector(".messages")
const impNick = document.querySelector(".nickImput")
const impid = document.querySelector(".idImput")
const imptext = document.querySelector(".msjImput")
const btnsend = document.querySelector("#btnSend").addEventListener("click", function(){
  sentMsj(impid.value,impNick.value,imptext.value)
})
imptext.addEventListener("keypress", function(e){
  var keyCode = e.keyCode;
  if(keyCode == 13){
      console.log("enter");
      sentMsj(impid.value,impNick.value,imptext.value)
  }
})

const msjArea = document.querySelector(".showmessages")

const url = 'http://34.210.35.174:7000/'

function getMsj(){
  fetch(url)
  .then(function(response) {
    var result = response.json()
    return result
  })
  .then(function(myJson) {
      myJson.forEach(function(element) {
      const div = formatDisplayName(element.nick, element.student_id)
      addToMsjListDisplay(div, element.text)
      })
      msjArea.scrollTop = msjArea.scrollHeight;
  })
}


  function addToMsjListDisplay(identificador, textToAdd){
    var li = document.createElement("li");
    li.appendChild(identificador)
    li.appendChild(document.createElement("br"))
    if (textToAdd.endsWith(".jpeg")||textToAdd.endsWith(".jpg")||textToAdd.endsWith(".png")||textToAdd.endsWith(".gif")){
      var img = document.createElement("img")
      img.src = textToAdd
      li.appendChild(img)
    }
    else{
      li.appendChild(document.createTextNode(textToAdd))
    }
    
    ulMsj.appendChild(li)
  }

  function formatDisplayName(user, id){
    const div = document.createElement("div")
    div.setAttribute("id", "nameAndId") 
    const text = user + " - " + id
    div.appendChild(document.createTextNode(text))
    return div
  }

  function sentMsj(st_id, nick, text){

    console.log(st_id)
    console.log(nick)
    console.log(text)

    const data = new FormData();
    if (st_id === "" || nick==="") {
			alert('Please enter the nickname and id');
			return;
		}

		// No message to send
		if (text === "") {
			alert('You must write a message');
			return;
    }
    // max 140 character
    if (text.length>140) {
			alert('The message have to be shorter than 140 characters');
			return;
    }
    data.append('student_id', st_id)
    data.append('text', text)
    data.append('nick', nick)
    const otherParam={
      method:"POST",
      body: data
    }
    fetch(url,otherParam).then(function(){
      const div = formatDisplayName(nick, st_id)
      addToMsjListDisplay(div, text)
      imptext.value = ""
      msjArea.scrollTop = msjArea.scrollHeight;
    }).catch(function(){
        aleer("Error Sending the message")
    })
  }


  setInterval(function() {
    // method to be executed;
    getMsj()
  }, 1500);
