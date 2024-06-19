var form=document.getElementById('myform');
var class_hide=document.getElementById('failed');

form.addEventListener('submit',function(event){
    event.preventDefault();

    const formData=new FormData(this);
    const jsonData={};

    formData.forEach((value,key)=>{
        jsonData[key]=value;
        
    })
    

    fetch('http://localhost/test/php/action.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(jsonData),
    })
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        if(data.status==='success'){
            console.log('data');
            window.location.href="http://localhost/test/hello.html";
            class_hide.classList.add('w3-hide');
        }else{
            console.log('failed');
            class_hide.classList.remove('w3-hide');
        }

    })
    .catch((error)=>{
        console.log(error);
    });

});