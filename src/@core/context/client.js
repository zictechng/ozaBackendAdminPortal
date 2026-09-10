
import axios from "axios";

//export devon network axios.create({baseURL: 'http://192.168.0.239:3500'})
//export home network axios.create({baseURL: 'http://192.168.1.73:3500'})

//export default axios.create({baseURL: 'https://crane-cuff-links.cyclic.cloud'})

//export default axios.create({baseURL: 'https://ozabackendapi.ozaapp.com'})

//export default axios.create({baseURL: 'https://ozabackendapi.ozaapp.com'})


export default axios.create({
  baseURL: 'http://192.168.1.73:3500',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});


