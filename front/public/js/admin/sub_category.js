const sub_delete_btns = document.querySelectorAll('#sub_delete_btn')
const sub_ca_name = document.querySelectorAll('.sub_ca_name')

sub_delete_btns.forEach( (v,i) => {
    v.addEventListener('click', async ()=>{
        const body = {
            s_name:sub_ca_name[i].value
        }

        console.log(body)

        try {
            const response = await axios.post('http://localhost:4000/admin/subDelete',body)
    
            if (response.data.errno !== 0) throw new Error('에러')
            alert('서브 카테고리가 삭제되었습니다.')
            location.href = '/'
        } catch (error) {
            console.log(error.message)
            alert('서브 카테고리 삭제를 실패하였습니다.')
        }
    })
})

const sub_add_btns = document.querySelectorAll('#sub_add_btn')

sub_add_btns.forEach( (v,i) => {
    v.addEventListener('click', async () => {
        
        const body = {
            m_idx:main_delete_btns[i].value,
            s_name:sub_ca_name[i].value
        }

        try {
            const response = await axios.post('http://localhost:4000/admin/subCategory',body)

            console.log(response.data)
            if (response.data.errno !== 0) throw new Error('에러')
            alert('서브카테고리 추가 성공')
            location.href = '/'
        } catch (error) {
            console.log(error.message)
            alert('서브카테고리 추가 실패')
        }
    })
}) 