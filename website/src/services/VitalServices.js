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
  static async getAllVitals(token){
  let vitals = []
  let drones = await axios.get("http://localhost:8080/drones", {
      headers: {
      "content-type": "application/json",
      "token": token
    }
  });
  drones = drones.data;
  for (let index = 0; index < drones.length; index++) {
    const drone = drones[index];
    let v = await axios.get(`http://localhost:8080/drones/${drone.id}/vitals`, {
      headers: {
      "content-type": "application/json",
      "token": token
    }
  });
    vitals.push({ id: drone.id, vitals: v });
  }
  return { status: 200, vitals: vitals };
}

    static async getLastLocation(token,droneId){
      
      return await axios.get("http://localhost:8080/drones/" + droneId + "/last_location",
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