#**Kitkard Server**

####**Installation**

<pre>
npm init --yes
npm install express
npm install nodemon -D
npm install morgan
npm install mongoose
brew install mongodb        // sudo apt install mongodb
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
mongod &                    // sudo service mongod start
<br>
//this is only for react native
npm i webpack -D
npm i webpack-cli -D
npm install webpack-clear-console -D
npm install react react-dom -D
npm install babel-core babel-loader babel-preset-react babel-preset-env -D
</pre>
<br>
<br>

####**Nginx settings**
<pre>
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
</pre>

