const board_write_btn = document.querySelector('#board_write_btn')

board_write_btn.addEventListener('click', async () => {

    

    const body = {
        subject:document.querySelector('#write_subject').value,
        content:document.querySelector('#write_content').value,
        hashtag,
        subcategory:document.querySelector('.sub_category_radio').value

    }

    console.log(body)
    
})