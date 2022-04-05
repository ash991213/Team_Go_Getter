const join_Frm = document.querySelector('#join_frm')
join_Frm.addEventListener('submit', async (e)=>{
  e.preventDefault()
  const body = {
    userid:document.querySelector('.reg_userid').value,
    userpw:document.querySelector('.reg_userpw').value,
    username:document.querySelector('.reg_username').value,
    nickname:document.querySelector('.reg_nickname').value,
    birthdate:document.querySelector('.reg_birthdate').value,
    adress:document.querySelector('.reg_adress').value,
    gender:document.querySelector('.reg_gender').value,
    mobile:document.querySelector('.reg_mobile').value,
    tel:document.querySelector('.reg_tel').value,
    email:document.querySelector('.reg_email').value,
    intro:document.querySelector('.reg_intro').value,
  }
  console.log(body);
  try {
    const response = await axios.post('http://localhost:4000/user/join',body,{
      'Content-type':'application/json',
      withCredentials:true,
    })
    if (response.data.errno !== 0) throw new Error('Error')
    alert('회원가입 성공.')
    location.href = 'http://localhost:3000'
  } catch (e) {
    alert('회원가입 실패.')
  }

})

// const join_btn = document.querySelector('#submit_frm')
// const userid = document.querySelector('.reg_userid').value
// const userpw = document.querySelector('.reg_userpw').value
// const username = document.querySelector('.reg_username').value
// const nickname = document.querySelector('.reg_nickname').value
// const birthdate = document.querySelector('.reg_birthdate').value
// const adress = document.querySelector('.reg_adress').value
// const gender = document.querySelector('.reg_gender').textContent
// const mobile = document.querySelector('.reg_mobile').value
// const tel = document.querySelector('.reg_tel').value
// const email = document.querySelector('.reg_email').value
// const intro = document.querySelector('.reg_intro').value

// join_btn.addEventListener('click',async (e)=> {
//   e.preventDefault()
//   const body = {
//     userid,
//     userpw,
//     username,
//     nickname,
//     birthdate,
//     adress,
//     gender,
//     mobile,
//     tel,
//     email,
//     intro,
//   }
//   console.log(body)
//   try {
//     const response = await axios.post('http://localhost:4000/user/join',body,{
//       'Content-type':'application/json',
//       withCredentials:true,
//     })
//     if (response.data.errno !== 0) throw new Error('Error')
//     alert('회원가입 성공.')
//     location.href = 'http://localhost:3000'
//   } catch (e) {
//     alert('회원가입 실패.')
//   }
// })