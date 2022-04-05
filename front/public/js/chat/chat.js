const socket = io.connect('http://localhost:4000/chat',{
    withCredentials:true
});

socket.on('connect',() => {
    console.log('클라이언트 웹 소켓 connect')
})

// 방입장 요청
const cr_idx = window.location.hash.split('#')[1]
socket.emit('title', cr_idx)

const chatList = document.querySelector('.chatting-list')
const chatInput = document.querySelector('.chatting-input')
const sendButton = document.querySelector('.send-button')
const displayContainer = document.querySelector('.display-container')
const title = document.querySelector('.title')

// 방제목 가져오기
socket.on('title',(data) => {
    title.textContent = data.title
})

// 메시지 보내는 함수
function send(){
    const param = {
        msg:chatInput.value
    }
    socket.emit('chat',param)
    chatInput.value = ''
}

// 클릭 or 엔터키로 메시지 보냄
sendButton.addEventListener('click', send)
chatInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13){
        send()
    }
})

// 채팅 내용을 화면에 보여줌
socket.on('chatting', (data)=> {
    const { msg, time, userid } = data
    const item = new LiModel( msg, time, userid);
    item.makeLi()
    displayContainer.scrollTo(0,displayContainer.scrollHeight)
})

// li 만드는 함수
function LiModel (msg,time,userid) {
    this.msg = msg;
    this.time = time;
    this.userid = userid;

    this.makeLi = async () => {
        const li = document.createElement('li')
        const dom = `<span class='profile'>
                     <span class='user'>${this.userid}</span>
                     <img class='image' src='https://placeimg.com/50/50/any' alt='any'></span>
                     <span class='message'>${this.msg}</span>
                     <span class='time'>${this.time}</span>`;
        
        li.innerHTML = dom;

        chatList.appendChild(li)

        const user = document.querySelector('.user')
        li.classList.add(user.textContent === this.userid ? 'sent':'received')
    }
}