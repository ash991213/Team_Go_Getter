const idCheckBtn = document.querySelector('#idcheck')

idCheckBtn.addEventListener('click',async (e) => {
    e.preventDefault()

    const body = {
        userid : document.querySelector('.reg_userid').value
    }

    const response = await axios.post('http://localhost:4000/user/idCheck',body)

    console.log(response.data.errno)

    if ( response.data.errno == 0 )
    alert('사용 가능한 아이디 입니다.')
    else
    alert('사용이 불가능한 아이디 입니다.')
})