var sequence = 0;


// const hostURL = 'http://127.0.0.1:5510/'
const hostURL = 'https://wetalk021.herokuapp.com/'


var user = {
  like: (e) => {
    // console.log(`liked: ${e.firstChild.src}`);

    if (e.firstChild.src == `${hostURL}public/icons/liked.png`) {
      like_button = "/public/icons/like.png"
      e.firstChild.src = like_button;
    } else {
      like_button = "/public/icons/liked.png"
      e.firstChild.src = like_button;
    }

    var post_id = e.parentNode.parentNode.className;

    if (post_id == 'extp') {
      post_id = e.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    }

    fetch(`${hostURL}activity/onpost/like`, {
      "method": "PUT",
      "headers": {
        "key": "12345",
        "content-type": "application/json"
      },
      "body": JSON.stringify({ post_id: post_id })
    })
      .then((Response) => {
        // console.log(Response);
        if (Response.status == 401) {
          window.location.href = '/login'
        }
        return Response.json();
      }).then((data) => {
        if (data.count != undefined) {
          if (data.count === 0) {
            var count = ''
          } else {
            count = data.count
          }

          e.innerHTML = `<img alt="like" src=${like_button} height="20px">${count}`
        }

      }).catch((err) => {
        console.error(err);
      })
  },
  get_news: function () {

    var loader = document.createElement("div");
    loader.setAttribute("class", "loader_area")
    loader.innerHTML = `<div class="loader"></div>`

    let news_feed = document.querySelector("#news_feed")
    news_feed.appendChild(loader);

    fetch(`${hostURL}activity/onpost/show`, {
      "method": "GET",
      "headers": {
        "key": "12345",
        "sequence": sequence,
        "content-type": "application/json"
      }
    })
      .then((Response) => {
        // console.log(Response);
        if (Response.status == 401) {
          window.location.href = '/login'
      }
        return Response.json();
      })
      .then((getData) => {
        // console.log(getData);

        document.querySelector(".loader_area").remove()

        if (getData.data) {
          getData.data.forEach((item, index) => {

            if (item) {

              /////////////////////////////////////////////

              var post = document.createElement("div");
              post.setAttribute("id", "post");
              post.setAttribute("class", item.post_id);

              var desc = document.createElement("div");
              desc.setAttribute("class", "desc");

              //create author

              var author = document.createElement("div");
              author.setAttribute("class", "author");

              var author_profile = document.createElement("a");
              author_profile.setAttribute("class", "author_profile");
              author_profile.setAttribute("href", `https://github.com/${item.author_github_ID}`);

              var img = document.createElement("img");
              img.setAttribute("src", item.author_profile_img);
              author_profile.appendChild(img);

              var name = document.createElement("span");
              name.innerText = item.author_name;
              author_profile.appendChild(name);

              author.appendChild(author_profile);

              var sub_nav = document.createElement("div");
              sub_nav.setAttribute("class", "sub-nav");
              if (getData.my_ID == item.login_ID) {
                sub_nav.innerHTML = '<img alt="image" src="/public/icons/three-dots.png"><div class="options"><div onClick="hidePost(this)">Hide from me</div><div>Save post</div><div onClick="deletionModal(this)" >Delete post</div></div>';
              } else {
                sub_nav.innerHTML = '<img alt="image" src="/public/icons/three-dots.png"><div class="options"><div onClick="hidePost(this)">Hide from me</div><div>Save post</div><div>Report post</div></div>';
              }

              author.appendChild(sub_nav);

              desc.appendChild(author);

              //create time

              var time = document.createElement("div");
              var seconds = (Date.now() - item.sequence) / 1000
              var minutes;
              var hours;
              var days;
              var monthes;
              var years;
              var time_count;
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
              time.setAttribute("class", "time");
              time.innerText = `${time_count} ago`
              desc.appendChild(time);


              post.appendChild(desc);

              //create content

              var content = document.createElement("div");
              content.setAttribute("class", "content");
              content.setAttribute("onclick", "showModal(this)");
              content.innerHTML = item.content;

              post.appendChild(content);

              var interaction = document.createElement("div");
              interaction.setAttribute("class", "interaction");
              if (item.like == 0) {
                var like = ''
              } else {
                var like = item.like
              }
              if (item.comment == 0) {
                var comment = ''
              } else {
                var comment = item.comment
              }
              if (item.liked) {
                like_button = "/public/icons/liked.png"
              } else {
                like_button = "/public/icons/like.png"
              }
              interaction.innerHTML = `  <div class="like" onclick="user.like(this)"><img alt="like" src="${like_button}" height="20px">${like}</div>  <div onclick="showModal(this)" class="comment"><img alt="image" src="/public/icons/comment.png" height="20px">${comment}</div>  <div class="share"><img alt="image" src="/public/icons/share.png" height="20px"></div>    `

              post.appendChild(interaction);


              let news_feed = document.querySelector("#news_feed")
              news_feed.appendChild(post);

              /////////////////////////////////////////////

            }

          });

          sequence = getData.sequence;

          setTimeout(function () { document.getElementById("news_feed").onscroll = function () { scrollEffect() } }, 100);

        } else {
          document.getElementById("news_feed").onscroll = function () { console.log("no more data... :-)"); }

          var post = document.createElement("div");
          post.setAttribute("id", "post");
          post.innerHTML = "no more feed    :-) "
          post.style.textAlign = "center";

          let news_feed = document.querySelector("#news_feed")
          news_feed.appendChild(post);
        }

      }).catch((err) => {
        console.log(err);
        // window.location.href = '/login'
      });
  }
}



function scrollEffect() {
  var winScroll = document.getElementById("news_feed").scrollTop || document.getElementById("news_feed").scrollTop;
  var height = document.getElementById("news_feed").scrollHeight - document.getElementById("news_feed").clientHeight;
  var scrolled = (winScroll / height) * 100;

  if (scrolled > 85) {
    // e.preventDefault()

    document.getElementById("news_feed").onscroll = function () { console.log("laps..."); }

    user.get_news()

  }

}





user.get_news()


// When the user scrolls the page, execute myFunction 
document.getElementById("news_feed").onscroll = function () { scrollEffect() };




