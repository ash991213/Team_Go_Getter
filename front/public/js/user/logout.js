const logout_btn = document.querySelector('#logout_btn')

logout_btn.addEventListener('click', async ()=>{
    const option = { withCredentials:true }

    try {
        const response = await axios.post('http://localhost:4000/user/logout',null,option)

        if (response.data.errno == 0)
        alert('로그아웃이 완료되었습니다.')
        location.href = '/'
    } catch (error) {

    }
})