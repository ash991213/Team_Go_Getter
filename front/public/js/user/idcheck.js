const idCheckBtn = document.querySelector('#idcheck')
const pro_idcheck = document.querySelector('#pro_idcheck')

pro_idcheck.addEventListener('click',async (e) => {
    e.preventDefault()

    const body = {
        userid : document.querySelector('#pro_userid').value
    }

    const option = {
        withCredentials:true,
    }

    try {
        const response = await axios.post('http://localhost:4000/user/idCheck',body,option)

        if ( response.data.errno == 0 )
        alert('사용 가능한 아이디 입니다.')
        else
        alert('사용이 불가능한 아이디 입니다.')
    } catch (error) {
        console.log(error.message)
    }
})

idCheckBtn.addEventListener('click',async (e) => {
    e.preventDefault()

    const body = {
        userid : document.querySelector('.reg_userid').value
    }

    try {
        const response = await axios.post('http://localhost:4000/user/idCheck',body)

        if ( response.data.errno == 0 )
        alert('사용 가능한 아이디 입니다.')
        else
        alert('사용이 불가능한 아이디 입니다.')
    } catch (error) {
        console.log(error.message)
    }
})