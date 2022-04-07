const search_btn = document.querySelector('#search_btn')
const search_input = document.querySelector('#search_input')

search_btn.addEventListener('click', async ()=>{

    const body = {
        data:search_input.value
    }

    try {
        const response = await axios.post('http://localhost:4000/user/find',body)

        const { result } = response.data
        
        if ( response.data.result.length == 0 )
        alert('일치하는 유저가 없습니다.')
    
        document.getElementById('search_userid').innerHTML = result[0].userid
        document.getElementById('search_username').innerHTML = result[0].username
        document.getElementById('search_nickname').innerHTML = result[0].nickname
        document.getElementById('search_birthdate').innerHTML = result[0].birthdate
        document.getElementById('search_adress').innerHTML = result[0].adress
        document.getElementById('search_gender').innerHTML = result[0].gender
        document.getElementById('search_mobile').innerHTML = result[0].mobile
        document.getElementById('search_tel').innerHTML = result[0].tel
        document.getElementById('search_email').innerHTML = result[0].email
        document.getElementById('search_intro').innerHTML = result[0].content
               
    } catch (error) {
        console.log(error.message)
    }
})