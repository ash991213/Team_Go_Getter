
var target = document.querySelectorAll('.btn_open');
// var btnPopClose = document.querySelectorAll('.pop_wrap');
var targetID;

// 팝업 열기
for(var i = 0; i < target.length; i++){
target[i].addEventListener('click', function(){
    targetID = this.getAttribute('href');
    document.querySelector(targetID).style.display = 'block';
});
}

