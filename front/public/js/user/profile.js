const profile_btn = document.querySelector('#profile_btn')

profile_btn.addEventListener('click', async () => {
    const option = {
        withCredentials:true,
    }

    try {
        const response = await axios.get('http://localhost:4000/user/edit',option)

        const { user } = response.data.result

        document.getElementById('pro_userid').value = user.userid
        document.getElementById('pro_userpw').value = user.userpw
        document.getElementById('pro_username').value = user.username
        document.getElementById('pro_nickname').value = user.nickname
        document.getElementById('pro_birthdate').value = user.birthdate
        document.getElementById('pro_adress').value = user.adress
        document.getElementById('pro_gender').innerHTML = user.gender
        document.getElementById('pro_mobile').value = user.mobile
        document.getElementById('pro_tel').value = user.tel
        document.getElementById('pro_email').value = user.email
        document.getElementById('pro_intro').value = user.content
        
    } catch (error) {
        console.log(error.message)
    }
})