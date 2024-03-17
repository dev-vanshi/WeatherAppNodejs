const http = require("http");
const fs = require("fs");
const axios = require("axios");

const homeFile = fs.readFileSync("index.txt", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const apikey = "7f50f06d55745cf0363199b5640b4fee";
const city = "srinagar"

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`
    )
      .then(response => {
        const objdata = response.data;
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        fs.writeFileSync('index.html',realTimeData);
        res.write(realTimeData);
      })
      .catch(error => {
        console.log("Error fetching weather data:", error);
        res.end("Error fetching weather data");
      });
} 
});

server.listen(8000, "127.0.0.1");
