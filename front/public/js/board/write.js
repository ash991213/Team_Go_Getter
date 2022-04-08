const board_write_btn= document.querySelector('#board_write_btn')

board_write_btn.addEventListener('click', async (e) => {
    e.preventDefault()
    let hashtag = new Array

    const hash = document.querySelectorAll('.write_hashtag')
    // const {upload} = e.target
    console.log(upload);
    const board_write = new FormData()
    FormData.append('upload',upload.files[0])
    console.log();

    hash.forEach( (v)=>{
        if (v.value != "")
        hashtag.push(v.value)
    })

    const body = {
        subject:board_write.querySelector('.write_subject').value,
        content:board_write.querySelector('.write_content').value,
        hashtag,
        subcategory:board_write.querySelector('.sub_category_radio').value,
        files:board_write.querySelector('#print')
    }
    console.log(body);
    
    alert('글 작성이 완료되었습니다.')
})