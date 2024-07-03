This monitor shows you the departure times of your public transportation station.

Open the monitor: [OEBB Monitor v2](https://dave2ooo.github.io/oebb-monitor-v2/?departure_station=1290401&show_line=true&show_clock=false&show_header=true)

## Personalize your Monitor
You can modify the ÖBB monitor by adding parameters to the URL in the Webpage card.
 
The following example URL updates data from Scotty every **60 seconds** and shows you the next **7 connections** from **Wien Hbf** to **Wien Floridsdorf Bahnhof** that departure in after **5 minutes** from now.
  
```
https://dave2ooo.github.io/oebb-monitor-v2/?
departure_station=1290401&
destination_station=1292101&
num_journeys=7&
additional_time=5&
update_interval=60&
show_header=true&
show_line=true
```
These are the parameters you can set.

| Parameter | Description |
| --- | --- |
| departure_station (required) | ID of the departure station. [Getting ÖBB station ID](#22-getting-öbb-station-id) |
| destination_station | ID of the destination station. If provided, the monitor only shows connections from your departure station to your destination station. [Getting ÖBB station ID](#22-getting-öbb-station-id) |
| hass_ip | IP address of your Homeassistant. This parameter can also be entered in the **script.js** file as shown in [Enter Homeassistant IP address](#5-enter-homeassistant-ip-address) |
| products_filter | Filtering the means of transportation (Train, Bus,...) |
| num_journeys | Number of connections to show (default: 6) |
| additional_time | Lead time in minutes (default: 0) |
| update_interval | Updates the data every X second(s) (default: 30) |
| show_clock | If "true", displays the current time (default: false) |
| show_header | If "true", displays the table header (default: false) |
| show_line | If "true", displays the transportation line |
