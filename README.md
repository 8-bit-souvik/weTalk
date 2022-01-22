# About weTalk
This is an inter-college social media application where users can interact to each others and share their ideas, doubts or any queries and can do like, comment to others' post.


<p align="center">
<img src="https://github.com/8-bit-souvik/weTalk/blob/master/public/icons/wetalk_logo.png" alt="weTalk logo" width="40%" border="0">
</p>

-------------------------------------------------------------------------------------------------------------------------------------------------------


<p align="center">
  <em>
    JavaScript
    · Node JS
    · Express
  </em>
  <br />
  <em>
    API
    · JSON
    · mongoose
  </em>
  <br />
  <em>
    HTML
    · CSS
    · ejs
  </em>
  <br />
  <em>
    Social media
    · blogging app
  </em>
  <br />
  <em>
    <a href="https://wetalk021.herokuapp.com/">
      Try it!
    </a>
  </em>
</p>

<p align="center">
 <img src="https://img.shields.io/badge/file%20count-204-yellow" /> 
 <img src="https://img.shields.io/badge/lines%20count-4132-brightgreen" /> 
 <img src="https://img.shields.io/badge/repo%20size-935.8 kB-blue" />
 <img src="https://img.shields.io/github/last-commit/8-bit-souvik/weTalk" /> 
 </p>
 
 <br/>
 
## [Click here to land on the Homepage](https://wetalk021.herokuapp.com/)


## Intro

[weTalk](https://wetalk021.herokuapp.com/) is a Social media application built with NodeJS where user can get socialize with each other by uploading post, like and comment on their posts.

## Summary

- First thing first, user have to signin with github account
- User can see What other users are posting
- User can also upload any post (till now only text), character limit: 1-1500
- User can like and comment in any post
- User can hide any post for that time from news feed
- User can delete his own post or comment


<br/>

## 💻 Tech Stack

#### Front-End:
 <img alt="CSS3" src="https://img.shields.io/badge/css3%20-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/> <img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/> 
 

#### Back-End:
<img alt="Javascript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/> <img alt="nodeJS" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>    <img alt="expressJS" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>    <img alt="JWT" src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/> <img alt="NPM" src="https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white"/>

#### DataBase:
<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/> 

#### Other:

 <img alt="GIT" src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white"/> <img alt="heroku" src="https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white"/>  <img alt="Docker" src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"/>  <img alt="AlpineJS" src="https://img.shields.io/badge/Alpine_Linux-0D597F?style=for-the-badge&logo=alpine-linux&logoColor=white"/> 

<br/>
<br/>


###  🌐 This application is now remotely hosted <br/>
### 👉 [here is the link](https://wetalk021.herokuapp.com/)

<br/>

###  💻 Or try to set it up locally:

# Local Environment setup 


## Create credentials in [imagekit.io](https://imagekit.io/)

after creating an account go to the [developer option](https://imagekit.io/dashboard/developer) and collect your `URL-endpoint`, `Public Key` and `Private Key`

![imagekit-demo](https://user-images.githubusercontent.com/72222987/150644016-a578b8d4-e211-4578-b2a9-a0a76095a347.png)



## dotenv file creation

In this dotenv file all keys and credentials for this web app will be stored.<br/>
Create a file named `.env` at the root of the directory, then fill these data given below:

<b> Paste your `Public Key`, `Private Key` and `urlEndpoint` which you have collected </b>
```
PORT = '5510'
passphrase = 'adhguiewhrh89fgrt6wterg23edg'
JWT_token = '56t3yde8u23g7d6847e823wr623e'
clientID = 'fcbda448c36edfee295f'
clientSecret = 'e33eb5206a91d3dbf55f1252d5bf462819b41dda'
mongoAddress = 'mongodb://localhost:27017/sampleBlog'
publicKey = <create yourself!>
privateKey = <create yourself!>
urlEndpoint = <create yourself!>
```

***if you have any other Mongo DataBase replace the given `mongoAddress` URI with your own.**


## NPM package installation

Install <b>Node JS</b> to run this program in server side.
open a terminal and go to it's root directory. <br/>
type `npm install` to install all NPM libraries mentioned in package.json as dependencies

## Run this app

environment setup is completed.<br/>
now start the server by running `npm start`<br/>
go to the browser and type URL `localhost:5510`<br/>

<br/>
<br/>
<br/>

###  📦 Or use Docker compose:

# Docker setup (Local Env)

## Docker engine installation
   install docker engine from [here](https://docs.docker.com/engine/install/)
   
## Docker Compose installation
   install docker compose from [here](https://docs.docker.com/compose/install/)
   
## Get docker-compose.yml:

   Save the [yml file](https://github.com/8-bit-souvik/weTalk/blob/master/docker-compose.yml) for docker-compose
    
 ## Pull and run containers
 
   - Run command `sudo docker-compose up` or `sudo docker-compose up -d` ([detached mode](https://docs.docker.com/engine/reference/run/#detached-vs-foreground)) to run containers
   - check those running containers by command: `sudo docker ps`
    
 ## Enjoy it!
 
   Go to the browser and type URL `localhost:5510`<br/>
    
<br>

<b>for any kind of problem or queries contact me on  &nbsp; <a href="https://twitter.com/souvik0759/"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"></a>  or  <a href="https://www.linkedin.com/in/souvikmandal20/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a>

DM is open 📩



<br>
<br>


![Screenshot from 2022-01-12 20-15-33](https://user-images.githubusercontent.com/72222987/149162387-97c6f5d8-cb0a-4146-8fae-12eb4448b2e4.png)









