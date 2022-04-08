const board_write = document.querySelector('#board_write')

board_write.addEventListener('click', async (e) => {
    e.preventDefault()
    const hash = board_write.querySelectorAll('.write_hashtag').value
    // for each문으로 돌려서 보내나?
    // console.log(hash);
    console.log(board_write.querySelector('.sub_category_radio').value);
    const body = {
        subject:board_write.querySelector('.write_subject').value,
        content:board_write.querySelector('.write_content').value,
        hashtag:board_write.querySelectorAll('.write_hashtag').value,

        subcategory:board_write.querySelectorAll('.sub_category_radio').value

    }
    console.log(body);
})