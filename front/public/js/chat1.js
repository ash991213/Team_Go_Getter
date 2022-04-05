document.addEventListener('DOMContentLoaded',async ()=>{
    const cr_idx = req
    console.log(cr_idx)

    const response = await axios.post('http://localhost4000/chat/title',idx,{withCredentials:true,})
    console.log(response)
})