const admin_login_form = document.querySelector('#admin_login_form')
admin_login_form.addEventListener('submit', async (e)=>{
    e.preventDefault()
    const userid = document.querySelector('#admin_userid')
    const userpw = document.querySelector('#admin_userpw')
    const body = {
        userid:userid.value,
        userpw:userpw.value,
    }
    try{
        const response = await axios.post('http://localhost:4000/admin/login',body,{
            'Content-type':'application/json',
            withCredentials:true,
        })
        console.log(response.data.errno);
        if (response.data.errno !== 0) throw new Error('Error')
        alert('관리자 로그인 성공.')
        location.href = 'http://localhost:3000'
    }catch (e){
        alert('관리자 로그인 실패.')
        location.href = '/'
    }
})