import axios from "axios";

class DroneServices {
    static async getAllDrones(token){
        
        console.log("This token:" + token);
        return axios.get("http://localhost:8080/drones",
        {
          headers: {
            "content-type": "application/json",
            "token": token
          },
        }
      );
    }
}

export default DroneServices;