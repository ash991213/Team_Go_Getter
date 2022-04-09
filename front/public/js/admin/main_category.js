const main_delete_btns = document.querySelectorAll('#main_delete_btn')

main_delete_btns.forEach( (v) => {
    v.addEventListener('click', async ()=>{
        const body = {
            m_idx:v.value
        }

        try {
            const response = await axios.post('http://localhost:4000/admin/mainDelete',body)
    
            if (response.data.errno !== 0) throw new Error('에러')
            alert('메인 카테고리가 삭제되었습니다.')
            location.href = '/'
        } catch (error) {
            console.log(error.message)
            alert('메인 카테고리 삭제를 실패하였습니다.')
        }
    })
})

const main_add_btns = document.querySelectorAll('#main_add_btn')
const main_ca_name = document.querySelectorAll('.main_ca_name')

main_add_btns.forEach( (v,i) => {
    v.addEventListener('click', async () => {
        const body = {
            m_name:main_ca_name[6-main_add_btns.length].value
        }

        try {
            const response = await axios.post('http://localhost:4000/admin/mainCategory',body)

            console.log(response.data)
            if (response.data.errno !== 0) throw new Error('에러')
            alert('메인카테고리 추가 성공')
            location.href = '/'
        } catch (error) {
            console.log(error.message)
            alert('메인카테고리 추가 실패')
        }
    })
}) 