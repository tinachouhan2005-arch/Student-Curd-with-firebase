const cl = console.log

const stdForm = document.getElementById('stdForm')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const contact = document.getElementById('contact')
const addstdBtn = document.getElementById('addstdBtn')
const updatestdBtn = document.getElementById('updatestdBtn')
const stdContainer = document.getElementById('stdContainer')
const spinner = document.getElementById('spinner')


const STD_URL ='https://xhrcurd-default-rtdb.asia-southeast1.firebasedatabase.app/'
const STUD_URL =`${STD_URL}/students.json`

let stdudentsArr =[]

function snackbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}

function showSpinner(){
    spinner.classList.remove('d-none')
}

function hideSpinner(){
    spinner.classList.add('d-none')
}

//read

function oncreateStd(arr){
    let result = ``
    arr.forEach((ele,i)=>{
        result +=`
             <tr id="${ele.id}">
                                    <td>${i + 1}</td>
                                    <td>${ele.fname}</td>
                                    <td>${ele.lname}</td>
                                    <td>${ele.email}</td>
                                    <td>${ele.contact}</td>
                                    <td><button onClick="editStd(this)" class="btn btn-sm btn-outline-primary" type="button">Edit</button></td>
                                    <td><button onClick="deleteStd(this)" class="btn btn-sm btn-outline-danger" type="button">Remove</button></td>
                                </tr>`
    });
    stdContainer.innerHTML = result
}

function readStd(){
    let xhr = new XMLHttpRequest()

    xhr.open("GET",STUD_URL,true)

    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            for(const key in res){
                res[key].id = key

                stdudentsArr.push(res[key])
            }
            oncreateStd(stdudentsArr)
        }else{
            cl('ERROR')
        }
    }
}
readStd()
