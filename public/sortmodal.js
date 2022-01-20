

var delete_action = {

    delete_post: (target) => {
        // console.log("deleting post... \n");

        fetch(`${hostURL}activity/onpost/delete_post`, {
            "method": "DELETE",
            "headers": {
                "key": "12345",
                "post_id": `${target}`,
                "content-type": "application/json"
            }
        })
            .then((Response) => {
                // console.log(Response);
                return Response.json();
            })
            .then((data) => {
                // console.log(data);
                window.location.href = '/home'
            })
            .catch((err) => {
                console.error(err);
                window.location.href = '/login'
            })
    },

    delete_comment: (target, comment_id) => {
        // console.log("deleting comment... \n");

        fetch(`${hostURL}activity/onpost/delete_comment`, {
            "method": "DELETE",
            "headers": {
                "key": "12345",
                "post_id": `${target}`,
                "comment_id": `${comment_id}`,
                "content-type": "application/json"
            }
        })
            .then((Response) => {
                // console.log(Response);
                return Response.json();
            })
            .then((data) => {
            //  console.log(data);
                // window.location.href = '/home'
                del_modal.style.display = 'none'
                comment_action.get_comments(target);
            })
            .catch((err) => {
                console.error(err);
                window.location.href = '/login'
            })
    },
}










var exp_span = document.querySelector(".close_exp")

exp_span.onclick = function () {
    document.querySelector(".prev_comments").innerHTML = '';
    modal.style.display = "none";
    document.querySelector(".modal-content").id = '0'
}

window.onclick = function (event) {
    if (event.target == modal) {
        document.querySelector(".prev_comments").innerHTML = '';
        modal.style.display = "none";
        document.querySelector(".modal-content").id = '0'
    }

    if (event.target == del_modal) {
        del_modal.style.display = "none";
        document.querySelector(".del_modal-content").id = "0"
        document.querySelector(".del_modal-content").removeAttribute("coid")
        document.querySelector(".del_modal-content").removeAttribute("delType")
    }
}

var del_modal = document.getElementById("del_myModal");

var del_btn = document.getElementById("del_myBtn");

var del_span = document.getElementsByClassName("del_close")[0];

function deletionModal(collect_id) {
    del_modal.style.display = "block";
    var post_id = collect_id.parentNode.parentNode.parentNode.parentNode.parentNode.className
    if (post_id == "extp") {
        post_id = collect_id.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id
    }
    // console.log(post_id);
    document.querySelector(".del_modal-content").setAttribute("delType", "post")
    document.querySelector(".del_modal-content").id = post_id;
}

del_span.onclick = function () {
    del_modal.style.display = "none";
    document.querySelector(".del_modal-content").id = "0"
    document.querySelector(".del_modal-content").removeAttribute("coid")
    document.querySelector(".del_modal-content").removeAttribute("delType")
}




document.querySelector(".del_delete").onclick = function () {

    var delType = document.querySelector(".del_modal-content").getAttribute("delType");

    if (delType === "post") {
        delete_action.delete_post(document.querySelector(".del_delete").parentNode.parentNode.id)     
    }
    
    if (delType === "comment") {
        delete_action.delete_comment(document.querySelector(".del_delete").parentNode.parentNode.id, document.querySelector(".del_modal-content").getAttribute("coid")) 
    }

   
}


function deletionModalComment(collect_id) {
    del_modal.style.display = "block";
    var  comment_id = collect_id.parentNode.parentNode.parentNode.id
    var post_id = collect_id.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id


    document.querySelector(".del_modal-content").setAttribute("delType", "comment")
    document.querySelector(".del_modal-content").id = post_id;
    document.querySelector(".del_modal-content").setAttribute("coid", comment_id)

}


function hidePost(collect_id) {
    var post_id = collect_id.parentNode.parentNode.parentNode.parentNode.parentNode.className
    if (post_id == "extp") {
        post_id = collect_id.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;

        document.getElementById(post_id).style.display = "none"
    } else{
        document.getElementsByClassName(post_id)[0].style.display = "none"
    }

}