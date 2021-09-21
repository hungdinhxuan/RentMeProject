const si = require('systeminformation');

async function cpuData() {
    try {
        const valueObject = {
            fsSize: 'fs, type, size, used, available, use, mount'
        }
        const data = await si.get(valueObject);
      console.log(data);
    } catch (e) {
        console.log(e)
    }
}

cpuData()