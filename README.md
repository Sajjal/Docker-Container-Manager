# Welcome

### Thank you for exploring S & D Docker Container Manager.

It is a web-based lightweight Container Orchestration application that allows easy and automatic scaling of Docker Containers in a Single Machine.

This application is developed using Node.js, Express.js, HTML, and CSS. MongoDB is used as a database. The user interface is responsive and minimal.

**Feel free to Clone and Fork. Commercial Distribution is Prohibited.**

---

## Background (_Why this application was developed?_)

I recently come to know about Docker and I was amazed by its architecture. Docker helps to isolate instances of an application inside the Host Machine and creates the foundation for a scalable system.

Although Docker is absolutely amazing by itself, it requires additional support to scale and manage the containers. Either manual or some form of Container Orchestration applications such as Docker Swarm, Kubernetes, or Apache Mesos.

All of the above mentioned Container Orchestration applications are great but they are designed to manage containers running on Multiple Servers. All of them require at least one Master node and some worker nodes. They are great for Enterprise level applications but for small scale applications, they do not add much value rather make things more complex.

Therefore, I decided to create this lightweight application to manage and scale Docker Containers in a Single Machine. This application consumes near to nothing server resources and gets the thing done.

I personally use Apache 2 Reverse Proxy Mod in the Ubuntu-based server to deploy my Personal projects. Therefore, this application is designed to work best on such systems. If you prefer Nginx, You only need to tweak `/modules/generateConf.js`.

---

## Features and Drawbacks:

### Features:

- Easy to Scale and Manage Docker Containers on a Single Machine.
- Automatically generates Apache .conf file and reloads the server for Load Balancing.
- Easy to Monitor the Health of Docker Containers.
- Automatically redirects SSL enabled Domains from http to https.

### Drawbacks:

- Does not perform well on non-Ubuntu based Distros.
- Does not support multi-server architecture.

---

## Prerequisites:

### Node.js:

- Install **Node.js** on your machine.

### MongoDB:

- Install and run **MongoDB** on your machine.

### Docker:

- Install and run **Docker** on your machine.

### Apache 2:

- Install and run **Apache 2** on your machine and enable Reverse Proxy Mod.

**P.S.**: Don't forget to modify TOKEN_SECRET on .env file.

---

## Installation:

1. Clone this Project.
2. Switch to the Root user.
3. Open terminal/command-prompt. **cd** to project directory and type:

   i. `npm install`

   ii. `npm start`

4. Type `http://localhost:3000` on your browser's address bar and hit Enter. **Enjoy.**

---

## Demo:

**Login Page:**

<img src="https://github.com/Sajjal/Lightweight-Docker-Container-Manager/blob/master/public/images/Screen_shots/login.png">

---

**Home Page:**

<img src="https://github.com/Sajjal/Lightweight-Docker-Container-Manager/blob/master/public/images/Screen_shots/home.png">

---

**Add New Project:**

<img src="https://github.com/Sajjal/Lightweight-Docker-Container-Manager/blob/master/public/images/Screen_shots/addnew.png">

---

**Manage Container:**

<img src="https://github.com/Sajjal/Lightweight-Docker-Container-Manager/blob/master/public/images/Screen_shots/manage.png">

---

**Generate Apache .conf File:**

<img src="https://github.com/Sajjal/Lightweight-Docker-Container-Manager/blob/master/public/images/Screen_shots/confconfig.png">

---

With Love,

**Sajjal**
