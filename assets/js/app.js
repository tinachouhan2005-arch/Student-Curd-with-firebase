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
                                            

const STD_URL =  'https://xhrcurd-default-rtdb.asia-southeast1.firebasedatabase.app'
const STUD_URL =  `${STD_URL}/students.json`

let stdudentsArr =  []

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function showSpinner(){
    spinner.classList.remove('d-none')
}

function hideSpinner(){
    spinner.classList.add('d-none')
}

//read

function oncreateStd(arr) {
    let result = ``
    arr.forEach((ele, i) => {
        result += `
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

function readStd() {
    showSpinner()
    let xhr = new XMLHttpRequest()

    xhr.open("GET", STUD_URL, true)

    xhr.send(null)

    xhr.onload = function () {
        if (xhr.status === 200) {
            let res = JSON.parse(xhr.response)
            for (const key in res) {
                res[key].id = key

                stdudentsArr.push(res[key])
            }
            oncreateStd(stdudentsArr)
            snackbar('All students list created successfully', 'success')
        } else {
            snackbar('something went wrong while rendering the data', 'error')
        }
    }
}
readStd()

//========================== Edit ====================================
function editStd(ele) {
    let EDIT_ID = ele.closest("tr").id;
    localStorage.setItem("EDIT_ID", EDIT_ID)
    let EDIT_URL = `${STD_URL}/students/${EDIT_ID}.json`
    let xhr = new XMLHttpRequest()
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            // cl(res)
            fname.value = res.fname
            lname.value = res.lname
            email.value = res.email
            contact.value = res.contact

            addstdBtn.classList.add("d-none")
            updatestdBtn.classList.remove("d-none")
        } else {

        }
    }
}
//========================== Update ====================================
function updateStudent(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")

    let UPDATE_URL = `${STD_URL}/students/${UPDATE_ID}.json`

    let updatedObj = {
        fname: fname.value,
        lname: lname.value,
        contact: contact.value,
        email: email.value,
        id: UPDATE_ID
    }

    let getIndex = stdudentsArr.findIndex(ele => ele.id === UPDATE_ID)
    stdudentsArr[getIndex] = updatedObj;

    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATE_URL);
    xhr.send(JSON.stringify(updatedObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            document.getElementById(UPDATE_ID).innerHTML = ` <td>${getIndex + 1}</td>
                                    <td>${updatedObj.fname}</td>
                                    <td>${updatedObj.lname}</td>
                                    <td>${updatedObj.email}</td>
                                    <td>${updatedObj.contact}</td>
                                    <td><button onClick="editStd(this)" class="btn btn-sm btn-outline-primary" type="button">Edit</button></td>
                                    <td><button onClick="deleteStd(this)" class="btn btn-sm btn-outline-danger" type="button">Remove</button></td>`
                                    addstdBtn.classList.remove("d-none")
                                    updatestdBtn.classList.add("d-none")

                                    stdForm.reset()
        } else {
            cl("Something went wrong")
        }
    }
}

updatestdBtn.addEventListener("click", updateStudent)
















function onSubmit(eve) {
    eve.preventDefault();
    showSpinner()

    let newStd = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value
    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", STUD_URL, true)

    xhr.send(JSON.stringify(newStd))

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            stdForm.reset()

            let tr = document.createElement('tr')
            tr.id = res.id
            tr.innerHTML = `<td>${stdudentsArr.length}</td>
                                    <td>${newStd.fname}</td>
                                    <td>${newStd.lname}</td>
                                    <td>${newStd.email}</td>
                                    <td>${newStd.contact}</td>
                                    <td><button onClick="editStd(this)" class="btn btn-sm btn-outline-primary" type="button">Edit</button></td>
                                    <td><button onClick="deleteStd(this)" class="btn btn-sm btn-outline-danger" type="button">Remove</button></td>`
            stdContainer.append(tr)

            snackbar(`New student with name ${newStd.fname} ${newStd.lname} created successfully`, 'success')
        } else {
            snackbar('something went wrong while creating new student', 'success')
        }
        hideSpinner()
    }

    xhr.onerror = function () {
        hideSpinner()
        cl("ERROR")
    }
}




function deleteStd(ele) {
    let deleteId = ele.closest('tr').id;
    // cl(deleteId)

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner()

            let delete_url = `${STD_URL}`
            let xhr = new XMLHttpRequest();

            xhr.open("DELETE", delete_url, true)

            xhr.send(null)

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)

                    ele.closest('tr').remove();

                    snackbar(`student with id ${deleteId} deleted successfully`, 'success')

                    let trs = document.querySelectorAll('#stdContainer tr td:first-child')
                    trs.forEach((e, i) => { e.innerText = i + 1 })
                } else {
                    snackbar('something went wrong while deleting the student', 'error')
                }
                hideSpinner()
            }

            xhr.onerror = function () {
                hideSpinner()
                snackbar('Error while deleting', 'error')
            }
        }
    });
}



stdForm.addEventListener('submit', onSubmit)