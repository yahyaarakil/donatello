import axios from "axios";

class VitalServices {
    static async getVital(token,droneId){
      
        return await axios.get("http://localhost:8080/drones/" + droneId + "/vitals",
        {
          headers: {
            "content-type": "application/json",
            "token": token
          },
        }
      );
    }
}

export default VitalServices;