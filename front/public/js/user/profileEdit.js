const profileEdit_btn = document.querySelector('#profileEdit_btn')

profileEdit_btn.addEventListener('click', async () => {
    
    const body = {
        userid:document.querySelector('#pro_userid').value,
        userpw:document.querySelector('#pro_userpw').value,
        username:document.querySelector('#pro_username').value,
        nickname:document.querySelector('#pro_nickname').value,
        birthdate:document.querySelector('#pro_birthdate').value,
        adress:document.querySelector('#pro_adress').value,
        mobile:document.querySelector('#pro_mobile').value,
        tel:document.querySelector('#pro_tel').value,
        email:document.querySelector('#pro_email').value,
        intro:document.querySelector('#pro_intro').value,
    }

    try {
        await axios.post('http://localhost:4000/user/edit',body)

        alert('프로필이 수정 되었습니다.')
    } catch (error) {
        console.log(error.message)
    }
})