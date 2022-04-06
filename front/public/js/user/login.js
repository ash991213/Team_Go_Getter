const login_frm = document.querySelector('#login_frm')
login_frm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const userid = document.querySelector('#login_userid')
    const userpw = document.querySelector('#login_userpw')
    const body = {
        userid:userid.value,
        userpw:userpw.value,
    }
    try{
        const response = await axios.post('http://localhost:4000/user/login',body,{
            'Content-type':'application/json',
            withCredentials:true,
        })
        if (response.data.errno !== 0) throw new Error('Error')
        alert('로그인 성공.')
        location.href = 'http://localhost:3000'
    }catch (e){
        alert('로그인 실패.')
        location.href = '/'
    }
})