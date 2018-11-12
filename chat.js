// for sockets
const socket = io.connect('http://localhost:3011')
//old variables
var oldMsjArray = []
var newMsjArray = []
const ulMsj = document.querySelector(".messages")
const impNick = document.querySelector(".nickImput")
const impid = document.querySelector(".idImput")
const imptext = document.querySelector(".msjImput")
const msjArea = document.querySelector(".showmessages")
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
// tomado de https://gist.github.com/pinceladasdaweb/6662290 
var Youtube = (function () {
  'use strict';
  var video, results;
  var getThumb = function (url, size) {
      if (url === null) {
          return '';
      }
      size    = (size === null) ? 'big' : size;
      results = url.match('[\\?&]v=([^&#]*)');
      video   = (results === null) ? url : results[1];
      if (size === 'small') {
          return 'http://img.youtube.com/vi/' + video + '/2.jpg';
      }
      return 'http://img.youtube.com/vi/' + video + '/0.jpg';
  };
  return {
      thumb: getThumb
  };
}());

function addToMsjListDisplay(identificador, textToAdd, theid){
  var li = document.createElement("li");
  if (theid === impid.value){
    li.className = "local_message"
  }

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
  send_by_socket(st_id, nick, text)
  //esto se debe seguir haciendo...
  imptext.value = ""
  msjArea.scrollTop = msjArea.scrollHeight;

}



// sends data to sever by a socket
  function send_by_socket(st_id, nick, text) {
    socket.emit('send_message',st_id, nick, text)
  }
// data from the server
function new_msj() {
  socket.on('new_message', function(onMessageReceived){
    console.log("new message!")
    const div = formatDisplayName(onMessageReceived.nick, onMessageReceived.student_id)
    addToMsjListDisplay(div, onMessageReceived.text, onMessageReceived.student_id)
    msjArea.scrollTop = msjArea.scrollHeight
  })
}

//historical messages
function first_conn() {
  console.log("getting new messages")
  socket.on('first_conn', function(onMessageReceived){
    onMessageReceived.forEach(function(element){
      const div = formatDisplayName(element.nick, element.student_id)
      addToMsjListDisplay(div, element.text, element.student_id)
    })
    msjArea.scrollTop = msjArea.scrollHeight
  })
}


var local_nick = prompt("Please enter your nick", "Jonnathan");
var local_id = prompt("Please enter your student ID", "15377");
impid.value= local_id
impNick.value = local_nick
first_conn()
new_msj()
