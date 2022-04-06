var selFile = document.querySelector('#sel-file');

selFile.onchange = function () { 
    var getList = this.files;
    
    // 읽기
    var reader = new FileReader();
    reader.readAsDataURL(getList[0]);

    //로드 한 후
    reader.onload = function  () {
        document.querySelector('#print').src = reader.result ;
    }; 
}; 