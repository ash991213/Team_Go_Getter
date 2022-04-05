const SEE_ALL_btn = document.querySelector('#SEE_ALL_btn');
const write_board = document.querySelector('#write_board');
const like_board = document.querySelector('#like_board');
const write_reply = document.querySelector('#write_reply');
const like_reply = document.querySelector('#like_reply');


SEE_ALL_btn.addEventListener('click', async () => {
    const option = {
        withCredentials:true,
    }

    const response = await axios.get('http://localhost:4000/user/edit',option)

    const { board } = response.data.result
    const { reply } = response.data.result
    const { likes_board } = response.data.result
    const { likes_reply } = response.data.result

    for (let i = 0; i< board.length; i++) {
        const li = document.createElement('li')

        let subject = board[i].subject

        li.innerHTML = subject

        write_board.appendChild(li)
    }

    for (let i = 0; i< reply.length; i++) {
        const li = document.createElement('li')

        let content = reply[i].content

        li.innerHTML = content

        like_board.appendChild(li)
    }

    for (let i = 0; i< likes_board.length; i++) {
        const li = document.createElement('li')

        let subject = likes_board[i].subject

        li.innerHTML = subject

        write_reply.appendChild(li)
    }

    for (let i = 0; i< likes_reply.length; i++) {
        const li = document.createElement('li')

        let content = likes_reply[i].content

        li.innerHTML = content

        like_reply.appendChild(li)
    }
})