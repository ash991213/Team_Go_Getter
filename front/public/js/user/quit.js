const quit_frm = document.querySelector('#quit_frm')

quit_frm.addEventListener('click', async (e) => {
    e.preventDefault()

    const option = {
        withCredentials:true,
    }

    try {
        const response = await axios.post('http://localhost:4000/user/quit',null,option)

        if ( response.data.errno === 0 )
        alert('회원 탈퇴가 완료되었습니다.')
        location.href = 'http://localhost:3000'

    } catch (error) {
        console.log(error.message)
    }
})