## URL-Shortener

URL Shortener takes long URLs as input and give shorter ones in return.

Features:
- URL Shortener
- Privacy Protection - users must register & log in in order to use the shortener and they only have access to their URLs
- Security Protection - password encryption, user authentication & timed session using the passport, limiting each user to 100 URLs
- Run as a Docker container
- Documentation

## How to Use the URL-Shortener:
* Create an account using your email.
* Log in to your account.
* Add a new URL and click shrink.
* You can click the short url or add the generated string after [https://surl1.herokuapp.com/](https://surl1.herokuapp.com/)

## Requirements

* Node.js
* Git


## Setup - run locally 

Step 1: Clone the repository and install the dependencies.

```bash
git clone https://github.com/benbz1/URL-Shortener
cd URL-Shortener-master
```

```bash
npm install
```

NOTE: in order to avoid deployment issues locally, I published my .env file temporarily jut to make things easier. **Therefore you can skip step 2**.

Step 2: Create .env file and add values for:
* SESSION_SECRET
* CONNECTION_STRING

Step 3: run 

```bash
npm run devStart
```

Step 4: Open [http://localhost:5000](http://localhost:5000).


### Alternative: Use Docker 
You can also run this app as a Docker container:

NOTE: since I published the .env file, the application should run successfully without adding any environment variables. If I hadn’t, at this point you would add a .env file or run the container with them. 

Step 1: Clone the repository 

```bash
git clone https://github.com/benbz1/URL-Shortener
cd URL-Shortener-master
```

Step 2: Building your image

```bash
docker build . -t url-shortener
```

Step 3: Run the image

```bash
docker run -p 49160:5000 -d url-shortener
```
Step 4: Open [http://localhost:49160](http://localhost:49160)

## Deployment 
This web app is already deployed on Heroku as [https://surl1.herokuapp.com]( https://surl1.herokuapp.com).

## In the future I hope to:
* Make a fancier web app
* Improve the security of the app
* Create a facility for backing up, mirroring, and/or archiving the URLs
* Include preventative measures against use of the service for nefarious purposes such as fraud, distribution of malware, or coordination of a bot net
