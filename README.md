# soyto.github.io

[![Join the chat at https://gitter.im/soyto/soyto.github.io](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/soyto/soyto.github.io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

List with all servers ranks

## INFO

 All data shown is truncated, you can look the whole data on <a href="https://onedrive.live.com/redir?resid=A6F68B73AE6BAE48!106&authkey=!AFGSFbCYU9lEuSw&ithint=folder%2c" target="_blank">OneDrive</a>


## How to download the project and use it.

**Warning** You need git and nodeJS running on your machine. Also will be great an Apache2 or Nginx to hots it.

1. on the folder that you want, write the following `git clone https://github.com/soyto/soyto.github.io.git`
2. once downloaded move to the folder just created `cd soyto.github.io`
3. install node dependencies `npm install`
4. install bower dependencies `bower install`
5. Rename `nodeApp/config.js.dist` to `nodeApp/config.js` and set up your gameforge account
5. Run grunt for compile whole project `grunt`

**You are done!** just let your web server to host this folder and you can access the data


## Application commands

The following list are grunt commands used on app.

- `grunt compile` or just `grunt` compiles the application generating the minified files and so
- `grunt crawler` Retrieves new data from gameforge web page and creates both server list and characterInfo
- `grunt create-players-database` With the data downloaded from the crawler just generates the characterInfo data, this command is used inside the crawler nowadays.
- `grunt generate-blog-files` Read *.md files from _posts folder and generates the blog system
- `publish` calls to compile task and makes a commit and push over github (Will ask for your account) without changing application version
- `publish-patch` like publish but increases patch version
- `publish-minor` like publish but increases minor version
- `publish-major` like publish but increases major version


## Project branches
- `master` this is the default branch that will be shown on the webpage
- `dev` primary development branch
- `data` over this branch is performed everyday `grunt crawler`task
