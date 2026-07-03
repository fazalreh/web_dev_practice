const fazalSelectorBtn=document.querySelector('#fazal-selector');
const waleedSelectorBtn=document.querySelector('#waleed-selector');
const chatHeader=document.querySelector('.chat-header');
const chatMessages=document.querySelector('.chat-messages');
const chatInputForm=document.querySelector('.chat-input-form');
const chatInput=document.querySelector('.chat-input');
const clearChatBtn=document.querySelector('.clear-chat-button');
const messages=JSON.parse(localStorage.getItem('messages')) || [];

const chatMessageElement=(message) =>`
<div class="message ${message.sender === 'Fazal' ? 'blue-bg' : 'gray-bg'}">
  <div class="message-sender">${message.sender}:</div>
  <div class="message-text">${message.text}</div>
  <div class="message-time">${message.timestamp}</div>
</div>
`
window.onload=()=>{
    if(messages.length>0){
        chatMessages.innerHTML='';
        messages.forEach((message)=>{
            chatMessages.innerHTML+=chatMessageElement(message);
        })
    }
}
let messageSender='Fazal';
const updateMessageSender=(name)=>{
    messageSender=name;
    chatHeader.textContent=`${messageSender} chatting...`;
    chatInput.placeholder=`Type here, ${messageSender}`;
    if (name==='Fazal')
    {
        fazalSelectorBtn.classList.add('active-person');
        waleedSelectorBtn.classList.remove('active-person');
    }
    if(name==='Waleed')
    {
        waleedSelectorBtn.classList.add('active-person');
        fazalSelectorBtn.classList.remove('active-person');
    }
    chatInput.focus();
}

fazalSelectorBtn.onclick=()=>updateMessageSender('Fazal');
waleedSelectorBtn.onclick=()=>updateMessageSender('Waleed');
const sendMessage=(e)=>{
    e.preventDefault();
    const timeStamp= new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric',hour12:true  });
    const message={
        sender:messageSender,
        text:chatInput.value,
        timestamp:timeStamp,
    }
    messages.push(message);
    localStorage.setItem('messages',JSON.stringify(messages));
    chatMessages.innerHTML+=chatMessageElement(message);
    chatInputForm.reset();
    chatMessages.scrollTop=chatMessages.scrollHeight;
}
chatInputForm.addEventListener('submit',sendMessage);
clearChatBtn.onclick=()=>{
    localStorage.removeItem('messages');
    chatMessages.innerHTML='';
    messages.length=0;
}
