const socket = io.connect('http://localhost:4000/chat',{
    withCredentials: true
});

socket.on('connect',() => {
    console.log('클라이언트 웹 소켓 connect')
})

const cr_idx = window.location.hash.split('#')[1]
socket.emit('title', cr_idx)

const nickname = document.querySelector('#nickname')
const chatList = document.querySelector('.chatting-list')
const chatInput = document.querySelector('.chatting-input')
const sendButton = document.querySelector('.send-button')
const displayContainer = document.querySelector('.display-container')

function send(){
    const param = {
        msg:chatInput.value
    }
    socket.emit('chat',param)
    chatInput.value = ''
}

sendButton.addEventListener('click', send)
chatInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13){
        send()
    }
})

socket.on('chatting', (data)=> {
    const { msg, time } = data
    const item = new LiModel( msg, time);
    item.makeLi()
    displayContainer.scrollTo(0,displayContainer.scrollHeight)
})

function LiModel (msg,time) {
    this.msg = msg;
    this.time = time;

    this.makeLi = () => {
        const li = document.createElement('li')
        li.classList.add(nickname.value === this.name ? 'sent':'received')
        const dom = `<span class='profile'>
        <span class='user'></span>
        <img class='image' src='https://placeimg.com/50/50/any' alt='any'></span>
        <span class='message'>${this.msg}</span>
        <span class='time'>${this.time}</span>`;
        li.innerHTML = dom;
        chatList.appendChild(li)
    }
}