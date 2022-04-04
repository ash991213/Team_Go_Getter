const join_Frm = document.querySelector('#join_frm')
join_Frm.addEventListener('submit', async (e)=>{
  e.preventDefault()
  const { userid, userpw, username, nickname,birthdate, adress, gender, mobile, tel, email, level } = e.target
  const formData = new FormData()
  formData.append('userid',userid)
  formData.append('userpw',userpw)
  formData.append('username',username)
  formData.append('nickname',nickname)
  formData.append('birthdate',birthdate)
  formData.append('adress',adress)
  formData.append('gender',gender)
  formData.append('mobile',mobile)
  formData.append('tel',tel)
  formData.append('email',email)
  formData.append('level',level)

  try {
    const response = await axios.post('http://localhost:4000/user/join',formData,{
      'Content-type':'application/json',
      withCredentials:true,
    })
    if (response.data.errno !== 0) throw new Error('Error')
    location.href = 'http://localhost:3000'
  } catch (e) {
    alert('회원가입 실패.')
  }

})