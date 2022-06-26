import axios from "axios";

class DroneServices {
  static async getAllDrones(token) {

    return await axios.get("http://localhost:8080/drones",
      {
        headers: {
          "content-type": "application/json",
          "token": token
        },
      }
    );
  }

  static async postMode(key, mode) {
    axios.post("http://localhost:8080/drones/" + key + "/missions/mode/" + mode,
      {

      },
      {
        headers: {
          "content-type": "application/json",
          "token": JSON.parse(sessionStorage.getItem("token"))
        }
      }).then(function (response) {
        if (response.data.message === "Success") {
          console.log("Success1")
        }
      })
  }
}

export default DroneServices;