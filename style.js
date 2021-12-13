// $(document).ready(function(){
//     // Activate tooltip
//     $('[data-toggle="tooltip"]').tooltip();
//
//     // Select/Deselect checkboxes
//     var checkbox = $('table tbody input[type="checkbox"]');
//     $("#selectAll").click(function(){
//         if(this.checked){
//             checkbox.each(function(){
//                 this.checked = true;
//             });
//         } else{
//             checkbox.each(function(){
//                 this.checked = false;
//             });
//         }
//     });
//     checkbox.click(function(){
//         if(!this.checked){
//             $("#selectAll").prop("checked", false);
//         }
//     });
// });
document.addEventListener("DOMContentLoaded", () => {
    getAddress('address')
    getHome()

});
// getAddress('address')
// getHome()
function save(){
    let name = $('#name').val();
    let email = $('#email').val();
    let address = $('#address').val();
    let img = $('#file')[0].files[0];
    let fd = new FormData();
    fd.append("file", img)
    let customer = {name: name, email: email, address: {id:address}};
    fd.append("customer", JSON.stringify(customer));


    $.ajax({
        url:"http://localhost:8080/customers/create",
        data: fd,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false,
        type:"POST",
        headers: {'Content-Type': undefined},

        success: getHome

    })
    $('#addNewCustomer').modal('hide');
    event.preventDefault();
}
function getHome(){
    $.ajax({
        type: "GET",
        url: 'http://localhost:8080/customers',
        success : function (data){
            let content = "";
            for (let i = 0; i < data.content.length; i++){

                content += '<tr><td>' +
                    '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox1" name="options[]" value="1">'+
                    '<label  for="checkbox1"></label>'+
                    '</span>'+
                    '</td>'+
                    getCustomer(data.content[i])
            }
            document.getElementById('customer').innerHTML = content;
            document.getElementById('page').innerHTML = getPage(data);

        }
    })
}
function getCustomer(customer){
    let img = "img/" + customer.image;
    return `<td>${customer.name}</td>`+
        `<td><img width="100" height="100" src="${img}" alt="Chưa có ảnh"></td>`+
        `<td>${customer.email}</td>`+
        `<td >${customer.address.name}</td>`+
        `<td>`+
        `<a href="#formEditCustomer" class="edit" onclick="editForm(this)" id="${customer.id}" data-toggle="modal">`+
        `<i class="material-icons"  data-toggle="tooltip" title="Edit">&#xE254;</i>`+
        `</a>`+
        `<a href="#deleteCustomer" onclick="getFormDelete(this)" class="delete" id="${customer.id}" data-toggle="modal">`+
        `<i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>`+
        `</a>`+
        `</td></tr>`;
}
// $(document).ready (function (){
//     $('.delete').click(function (event){
//         let a = $(this);
//         let id = a.attr("href");
//         $.ajax({
//             type:"DELETE",
//             url:"api/customers/" + id,
//             success:function (){
//                 a.parent().parent().remove();
//             }
//         })
//     })
//     event.preventDefault();
// })
function getFormDelete(a){
    let id = a.getAttribute("id");
    let content = `<input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">`+
        `<input type="submit" href="` +id+ `" onclick="deleteCustomer(this)" class="btn btn-danger" value="Delete">`
    document.getElementById('delete').innerHTML = content;
}
function deleteCustomer(a){
    let id = a.getAttribute("href");
    $.ajax({
        type:"DELETE",
        url:'http://localhost:8080/customers/' + id,
        success:getHome

    })
    $('#deleteCustomer').modal('hide');
    event.preventDefault();
}
function editForm(a){
    let id = a.getAttribute("id");
    $.ajax({
        type:"GET",
        url: 'http://localhost:8080/customers/findOne/'+ id,
        headers:{
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        success:function (data){
            let img = "img/" + data.image;
            getAddress('addressEdit', data.address.id)
            let address = document.getElementById('addressEdit').innerHTML
            alert(address)
            let content = `<div class="modal-header">`+
                `<h4 class="modal-title">Edit</h4>`+
                `<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>`+
                `</div>`+
                `<div class="modal-body">`+
                `<div class="form-group" hidden>`+
                `<label>id</label>`+
                `<input type="text" value="${data.id}" class="form-control" required id="customerId">`+
                `</div>`+
                `<div class="form-group">`+
                `<label>Name</label>`+
                `<input type="text" class="form-control" required id="name2" value="${data.name}">`+
                `</div>`+

                `<img width="100" height="100" src="${img}" alt="Chưa có ảnh">`+
                `<div class="form-group">`+
                    `<label>Image</label>`+
                `<input type="text"  value="${data.image}" hidden id="image2">`+
                    `<input type="file" class="form-control" name="image2" required id="file2">`+
                `</div>`+

                `<div class="form-group">`+
                `<label>Email</label>`+
                `<input type="text" class="form-control" required id="email2" value="${data.email}">`+
                `</div>`+
                `<div class="form-group">`+
                `<label>Address</label>`+
                `<select name="address" id="address">`+
                address+
                `</select>`+

                `</div>`+
                `</div>`+
                `<div class="modal-footer">`+
                `<input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">`+
                `<input type="submit" class="btn btn-success" onclick="edit()" value="save">`+
                `</div>`
            document.getElementById('editCustomer').innerHTML= content;
        },

    })

}
function customerEdit(customer){
    return `<div class="modal-header">`+
        `<h4 class="modal-title">Edit</h4>`+
        `<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>`+
        `</div>`+
        `<div class="modal-body">`+
        `<div class="form-group" hidden>`+
        `<label>id</label>`+
        `<input type="text" value="${customer.id}" class="form-control" required id="customerId">`+
        `</div>`+
        `<div class="form-group">`+
        `<label>Name</label>`+
        `<input type="text" class="form-control" required id="name2" value="${customer.name}">`+
        `</div>`+
        `<div class="form-group">`+
        `<label>Email</label>`+
        `<input type="text" class="form-control" required id="email2" value="${customer.email}">`+
        `</div>`+
        `<div class="form-group">`+
        `<label>Address</label>`+
        `<select name="address" id="address">`+

        `</select>`+

        `</div>`+
        `</div>`+
        `<div class="modal-footer">`+
        `<input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">`+
        `<input type="submit" class="btn btn-success" onclick="edit()" value="save">`+
        `</div>`
}
function getAddress(id, addressId){
    // let content =  document.getElementById('address').innerHTML
    // return content;
    $.ajax({
        type:"GET",
        url:'http://localhost:8080/api/address',
        success: function (data){
            let content = "";
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === addressId){
                    content += `<option selected value="${data[i].id}" >${data[i].name}</option>`
                }
                else {
                    content += `<option value="${data[i].id}" >${data[i].name}</option>`
                }
            }
            document.getElementById(id).innerHTML = content;
        }

    })
}
function edit(){
    let id = $('#customerId').val();
    let name = $('#name2').val();
    let email = $('#email2').val();
    let address = $('#address2').val();
    let img = $('#file2')[0].files[0];
    let image = $('#image2').val()
    let fd = new FormData();
    fd.append("file", img)
    let customer = {id: id, name: name, email: email, address: {id:address}, image:image};
    fd.append("customer", JSON.stringify(customer));


    $.ajax({
        url:"http://localhost:8080/customers/create",
        data: fd,
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false,
        type:"POST",
        headers: {'Content-Type': undefined},

        success: getHome

    })
    $('#formEditCustomer').modal('hide');
    event.preventDefault();


}
function getPage(page){
    if ( page.totalPages > (page.pageable.pageNumber + 1) ){
        return `<ul class="pagination">`+
            `<li class="page-item disabled">`+
            `<a href="${page.pageable.pageNumber - 1}" onclick="page(this)">Previous</a>`+
            `</li>`+
            `<li class="page-item"><span>${page.pageable.pageNumber + 1}</span>/`+
            `<span>${page.totalPages}</span>`+
            `</li>`+
            `<li class="page-item"><a href="${page.pageable.pageNumber + 1}" onclick="page(this)" class="page-link">Next</a>`+
            `</li>`+
            `</ul>`
    }
    else {
        return `<ul class="pagination">`+
            `<li class="page-item disabled">`+
            `<a href="${page.pageable.pageNumber - 1}" onclick="page(this)">Previous</a>`+
            `</li>`+
            `<li class="page-item"><span>${page.pageable.pageNumber + 1}</span>/`+
            `<span>${page.totalPages}</span>`+
            `</ul>`
    }
}
function page(a){
    let page = a.getAttribute("href");
    $.ajax({
        type:"GET",
        url: "http://localhost:8080/customers?page="+ page,
        headers:{
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        success : function (data){
            let content = "";
            for (let i = 0; i < data.content.length; i++){

                content += '<tr><td>' +
                    '<span class="custom-checkbox">'+
                    '<input type="checkbox" id="checkbox1" name="options[]" value="1">'+
                    '<label  for="checkbox1"></label>'+
                    '</span>'+
                    '</td>'+
                    getCustomer(data.content[i])
            }
            document.getElementById('customer').innerHTML = content;
            document.getElementById('page').innerHTML = getPage(data);

        }
    })
    event.preventDefault();
}