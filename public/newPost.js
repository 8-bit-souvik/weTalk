
var imagekit = new ImageKit({
    publicKey: "public_didX9wfZiv5DrABxZgaKOYmNRuE=",
    urlEndpoint: "https://ik.imagekit.io/weTalk/images",
    authenticationEndpoint: `${hostURL}auth/imagekit/redirect`,
});


function move() {
    document.querySelector("#background-progress").style.display = 'block'
    let i = 0;
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 10);
        function frame() {
            if (width >= 90) {
                clearInterval(id);
            } else if (width < 25) {
                width = width + 0.1;
                elem.style.width = width + "%";
            } else if (width < 50) {
                width = width + 0.05;
                elem.style.width = width + "%";
            } else if (width < 70) {
                width = width + 0.02;
                elem.style.width = width + "%";
            } else {
                width = width + 0.005;
                elem.style.width = width + "%";
            }
        }
    }
}

function loadFile(event) {
    var imageViewer = document.querySelector('.image-viewer');
    imageViewer.innerHTML = `<img id="raw-image" src="${URL.createObjectURL(event.target.files[0])}" height="56px" weight="60px"> <span title="delete image" style="cursor: pointer; color: brown" onclick="deleteImage()"><b>X</b><span>`;
};
function deleteImage() {
    var imageViewer = document.querySelector('.image-viewer');
    imageViewer.innerHTML = "Add Image"
    document.getElementById("file").files[0] = null
}



var user = {
    post: function (content) {
        var file = document.getElementById("file");

        if (file.files[0]) {
            move()
            imagekit.upload({
                file: file.files[0],
                fileName: "img.jpg"
            }, function (err, result) {
                if (err) {
                    console.log(err);
                    document.querySelector("#background-progress").style.display = 'none';
                    document.querySelector(".warning_msg").innerHTML = err.msg;
                } else {
                    // console.log(result);
                    // console.log(arguments);
                    var mediaURL = imagekit.url({
                        src: result.url,
                        transformation: [{ width: 600 }]
                    })
                    console.log(mediaURL);


                    let data = { content: content, media: mediaURL, mediaId: result.fileId }
                    user.upload_data(data)
                }
            });
        } else {
            let data = { content: content, media: '', mediaId: '' }

            if (content.length < 1501 && content.length > 1) {
                move()
                user.upload_data(data)
            } else {
                setTimeout(clearAlert, 2500)
                document.querySelector(".warning_msg").innerHTML = `<p style="color:brown; text-align: center">word limit not matched! (must be within 2-600)</p>`
            }

            function clearAlert() { document.querySelector(".warning_msg").innerHTML = '' }
        }

    },

    upload_data: function (data) {
        let content = data.content
        let media = data.media
        let mediaId = data.mediaId
        fetch(`${hostURL}activity/onpost/create`, {
            "method": "POST",
            "headers": {
                "key": "12345",
                "content-type": "application/json"
            },
            "body": JSON.stringify({
                content: content,
                media: media,
                mediaId: mediaId
            })
        })
            .then((Response) => {
                document.querySelector("#background-progress").style.display = 'none'
                if (Response.status == 200) {
                    window.location.href = '/home'
                }
                return Response.json();
            })
            .then((getData) => {
                console.log(getData);
                document.querySelector(".warning_msg").innerHTML = `${getData.msg} <br>`
            }).catch((err) => {
                console.log(err);
                window.location.href = '/login'
            });
    }
}

document.querySelector("#submit").addEventListener("click", (e) => {
    e.preventDefault()
    let content = document.querySelector("#input").value
    user.post(content)
});