const profile_btn = document.querySelector('#profile_btn')

profile_btn.addEventListener('click', async () => {
    const option = {
        withCredentials:true,
    }

    const response = await axios.get('http://localhost:4000/user/edit',option)

    const { user } = response.data.result
    document.getElementById('pro_userid').innerHTML = user.userid
    document.getElementById('pro_userpw').innerHTML = user.userpw
    document.getElementById('pro_username').innerHTML = user.username
    document.getElementById('pro_nickname').innerHTML = user.nickname
    document.getElementById('pro_birthdate').innerHTML = user.birthdate
    document.getElementById('pro_adress').innerHTML = user.adress
    document.getElementById('pro_gender').innerHTML = user.gender
    document.getElementById('pro_mobile').innerHTML = user.mobile
    document.getElementById('pro_tel').innerHTML = user.tel
    document.getElementById('pro_email').innerHTML = user.email
    document.getElementById('pro_intro').innerHTML = user.content
})