# oebb-monitor-v2

This monitor shows you the departure times of your public transportation station.

Example of the monitor: [OEBB Monitor v2](https://dave2ooo.github.io/oebb-monitor-v2/?departure_station=1290401&show_line=true&show_clock=false&show_header=true)

# Personalize your Monitor
You can modify the ÖBB monitor by adding parameters to the URL. This [OEBB Link Creator](https://dave2ooo.github.io/oebb-link-creator/html/mode1.html) makes it easy to do so
 
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
| show_line | If "true", displays the transportation line (defaut: false) |
| show_direction | If "false", hides the direction (default: true) |
| show_platform | If "true", shows the platform (default: false) |
| font_size | Font size of every element using CSS units e.g. 20px, 1.5rem (default: 3vw) |
| eq_stops | true / false, I don't know what it does (default: false) |
| background_color | Sets the background color of the monitor (defualt: #323232) |
| font_color | Sets the font color of the monitor (defualt: white) |
