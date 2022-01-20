var modal = document.getElementById("myModal");

var content = document.getElementsByClassName("content");
// var comment = document.getElementsByClassName("comment");



var comment_action = {

    post_comment: (target, comment) => {
        fetch(`${hostURL}activity/onpost/comment`, {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                target: target,
                comment: comment
            })
        })
            .then((Response) => {
                // console.log(Response);
                if (Response.status == 401) {
                    window.location.href = '/login'
                }
                return Response.json();
            })
            .then((data) => {
                comment_action.get_comments(target);
                if (data.msg) {
                    document.querySelector("#comment-alert-msg").innerHTML = `<p style="color:brown">${data.msg}</p>`
                }
                // console.log(data);
            })
            .catch((err) => {
                console.error(err);
            })
    },

    get_comments: (e) => {
        // console.log(e);
        document.querySelector(".prev_comments").innerHTML = '';
        document.querySelector(".write_new_comment").value = "";
        document.querySelector(".loader_area").style.display = "flex";
        fetch(`${hostURL}activity/onpost/showcomments`, {
            "method": "GET",
            "headers": {
                "key": "12345",
                "post_id": e,
                "content-type": "application/json"
            }
        })
            .then((Response) => {
                // console.log(Response);
                if (Response.status == 401) {
                    window.location.href = '/login'
                }
                document.querySelector(".loader_area").style.display = "none";
                return Response.json();
            })
            .then((getData) => {

                if (getData.data) {

                    if (getData.data.length > 0) {
                        var comment_count = document.createElement("div");
                        comment_count.innerHTML = `${getData.data.length} comments <br> <br>`

                        let prev_comments_section = document.querySelector(".prev_comments")
                        prev_comments_section.appendChild(comment_count);
                    }


                    getData.data.forEach((item, index) => {

                        /////////////////////////////////////////////

                        var post = document.createElement("div");
                        post.setAttribute("class", "comment_section");
                        post.setAttribute("id", item.comment_id);

                        var exp_author = document.createElement("div");
                        exp_author.setAttribute("class", "exp_author");

                        //create author

                        var exp_author_img = document.createElement("div");
                        exp_author_img.setAttribute("class", "exp_author_img");

                        var img = document.createElement("img");
                        img.setAttribute("src", item.author_profile_img);
                        img.setAttribute("height", "35px");
                        img.setAttribute("width", "35px");
                        img.setAttribute("style", "border-radius: 50%; border: 1px rgb(142, 142, 142) solid;");

                        exp_author_img.appendChild(img)

                        exp_author.appendChild(exp_author_img);

                        // exp_author.appendChild(name);

                        var name = document.createElement("div");
                        name.setAttribute("class", "exp_author_name");
                        name.innerText = item.author_name;
                        exp_author.appendChild(name);

                        var sub_nav = document.createElement("div");
                        sub_nav.setAttribute("class", "exp_comment_options");
                        if (item.author_login_id == getData.my_ID) {
                            sub_nav.innerHTML = '<img src="/public/icons/three-dots.png" width="35px">  <div class="report_comment" onClick="deletionModalComment(this)">delete comment</div>';
                        } else {
                            sub_nav.innerHTML = '<img src="/public/icons/three-dots.png" width="35px">  <div class="report_comment">report comment</div>';
                        }
                        exp_author.appendChild(sub_nav);

                        post.appendChild(exp_author);



                        var content = document.createElement("div");
                        content.setAttribute("class", "comment_content");
                        content.innerHTML = item.content;

                        post.appendChild(content);

                        //create time
                        var seconds = (Date.now() - item.time) / 1000
                        var minutes;
                        var hours;
                        var days;
                        var monthes;
                        var years;
                        var time_count = null;
                        if (seconds > 59) {
                            minutes = seconds / 60
                            if (minutes > 59) {
                                hours = minutes / 60
                                if (hours > 23) {
                                    days = hours / 24
                                    if (days > 29) {
                                        monthes = days / 30
                                        if (monthes > 11.9) {
                                            years = monthes / 12
                                            time_count = `${Math.round(years)}y`
                                        } else {
                                            time_count = `${Math.round(monthes)}mo`
                                        }
                                    } else {
                                        time_count = `${Math.round(days)}d`;
                                    }
                                } else {
                                    time_count = `${Math.round(hours)}h`;
                                }
                            } else {
                                time_count = `${Math.round(minutes)}m`;
                            }
                        } else {
                            time_count = `${Math.round(seconds)}sec`;
                        }

                        if (item.likes.length <= 0) {
                            var likes = ''
                        } else {
                            var likes = item.likes.length
                        }

                        var comment_interaction = document.createElement("div");
                        comment_interaction.setAttribute("class", "comment_interaction");
                        comment_interaction.innerHTML = `<div class="like"><img alt="like" onclick="comment_action.like(this)" src="/public/icons/like.png" height="15px">${likes}</div> <div class="time">${time_count}</div></div>`

                        post.appendChild(comment_interaction);

                        let prev_comments_section = document.querySelector(".prev_comments")
                        prev_comments_section.appendChild(post);

                        /////////////////////////////////////////////

                    });

                }


                // return console.log(getData);

            })
            .catch((err) => {
                console.error(err);
            })
    }

}

function showModal(e) {
    if (e.className == 'content') {
        var post_id = e.parentNode
    } else if (e.className == 'comment') {
        var post_id = e.parentNode.parentNode
    }

    if (post_id.className != "extp") {
        // console.log(post_id.className);
        comment_action.get_comments(post_id.className);

        document.querySelector(".modal-content").id = post_id.className

        document.querySelector(".extp").innerHTML = post_id.innerHTML

        modal.style.display = "block";
    }

}

document.querySelector(".post_new_comment").addEventListener("click", function () {
    var content = document.querySelector(".write_new_comment").value;
    var target = document.querySelector(".modal-content").id;
    if (content.length < 600 && content.length > 1) {
        comment_action.post_comment(target, content)
    } else {
        setTimeout(clearAlert, 3000)
        document.querySelector("#comment-alert-msg").innerHTML = `<p style="color:brown; text-align: center">word limit not matched! (must be within 2-600)</p>`
    }

    function clearAlert() { document.querySelector("#comment-alert-msg").innerHTML = '' }

});






