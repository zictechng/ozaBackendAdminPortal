
import axios from "axios";

//export default axios.create({baseURL: 'http://172.20.10.9:3500'})

//export default axios.create({baseURL: 'http://192.168.1.83:3500'})

//export default axios.create({baseURL: 'http://192.168.43.228:3500'})

//export default axios.create({baseURL: 'http://192.168.1.169:3500'});

//export default axios.create({baseURL: 'https://crane-cuff-links.cyclic.cloud'})

//export default axios.create({baseURL: 'https://ozabackendapi.ozaapp.com'})

//export default axios.create({baseURL: 'https://ozabackendapi.ozaapp.com'})


export default axios.create({
  baseURL: 'http://192.168.0.239:3500',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});


