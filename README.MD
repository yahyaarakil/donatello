# 🐢 Donatello Kaplumbaga: A semi-autonomous sea surface cleaning rover.

## 💫  What is Donatello?
Donatello is a semi-autonomous coastline cleaning vessel. It allows for an easy and low cost approach for cleaning coastline sea surfaces.
**Donatello Kaplumbaga** is a [METU NCC](https://ncc.metu.edu.tr/) multidisciplinary graduation project by the [Computer Engineering](https://ncc.metu.edu.tr/cng/home) & [Electrical/Electronic Engineering](https://ncc.metu.edu.tr/eee/home) departments.

![Main](https://github.com/yahyaarakil/donatello/blob/main/images/main_image.png)

The **Donatello Kaplumbaga** rover software is composed of 3 parts, the rover controller, the webserver, and the web application.

## 💫  Features
 - 🤖 Autonomous cleaning operation
 - 👤 Easy to use interface
 - 🛤️ Comprehensive vessel tracking
 - 🌞 Sustainable energy source (solar)
 - 🧮 Extensible framework
 - 🚚 Fleet management
 - 📅 Mission scheduling

## 📖 Setting up and running the different software parts
 - ### [🕹️ Rover Controller](#)
    The rover controller should be installed on the raspberry pi within the vessel system.
    1. Clone the repository to the raspberry pi `git clone https://github.com/yahyaarakil/donatello.git`
    2. Edit the `donatello/controller/config.py` file by creating a unique drone identifier and changing the ARDUPILOT_ADDRESS to `/dev/ttyACM0` for the USB address or `localhost:5762` for the simulation
    3. And make sure the SERVER_ADDRESS is set to the correct server IP address, usually `localhost:8080`
    4. Start the `donatello/controller/donatello_start.py` file
 - ### [📡 Web Server](#)
    1. Install NPM
    2. Navigate to `cd donatello/server`
    3. Initialize the server dependencies `npm install`
    4. Setup the `.env` file with the parameters
       1. MONGODB_URL=""
       2. MONGODB_TEST_URL=""
       3. HTTPS_PORT=8080
       4. WSS_PORT=5050
       5. TOKEN_SIGNATURE_KEY=""
       6. APP_ORIGIN="*"
    5. Start the server `npm run server`
 - ### [📱 Web Application](#)
    1. Install NPM
    2. Navigate to `cd donatello/website`
    3. Initialize the server dependencies `npm install`
    4. Start the application `npm start`

## ⚙️ Under the hood
 - Donatello Vessel Prototype
![Main](https://github.com/yahyaarakil/donatello/blob/main/images/body_image.png)

 - System
![Main](https://github.com/yahyaarakil/donatello/blob/main/images/system_image.png)

 - Controller Framework
![Main](https://github.com/yahyaarakil/donatello/blob/main/images/framework_image.png)

 - Server
![Main](https://github.com/yahyaarakil/donatello/blob/main/images/server_image.png)