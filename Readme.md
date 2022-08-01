# Notif-trails

This is a scraper for BC Parks daypass availability. Made since there is no way to waitlist for daypasses to visit beautiful BC trails. This script will let you know if someone cancels their pass or another spot opens up so you can quickly reserve a pass for yourself. 

This script **WILL NOT** book the daypass for you. It is simply used to notify in case of spots opening up. Automatic booking cannot be done due to captcha requirements.

Setup the `config.js` for the day, pass type, and park you want to visit and run with `yarn start`. The script will poll the API every 10s until a spot opens up and it will then play a notification sound on your computer!

# Install and Run

- install modules with `yarn`
- modify the `config.js`
- run the system `yarn start`

# Configuration

A sample configuration is included: (the one I used to get a spot in Joffre Lakes the night before)

```
export default {
    "park": "Joffre Lakes Provincial Park",
    "name": "Joffre Lakes",
    "type": "Trail",
    "period": "DAY",
    "date": "2022-07-31"
};
```

`"park"` field with the park you are looking for. You need to copy this exactly from the BCParks daypass site to ensure the correct API call is made.

`"name"` field comes from the Pass Type dropdown in the https://reserve.bcparks.ca/dayuse/registration site. It should match the part before the hyphen in this dropdown.

`"type"` specifies the type of pass to poll, it comes from the second half of the dropdown specified above

`"period"` should be defined for which time period you would like to book for. Different parks provide different values for example Joffre Lakes only allows full day passes so the value should be DAY. Some parks allow for AM or PM booking too. This comes from the blocks after the dropdown is selected.

`"date"` specifies the day you want to poll for. it is in the format "YYYY-MM-DD". You can't poll for days that are more than 2 days away, since the passes only become available 2 days before at 7am.

# Copy paste configurations

Use these cookie cutter examples for the parks available in 2022.

## Joffre Lakes

Configuration to poll for day passes on July 31, 2022. Copy this and change the date to the one you'd like

```
export default {
    "park": "Joffre Lakes Provincial Park",
    "name": "Joffre Lakes",
    "type": "Trail",
    "period": "DAY",
    "date": "2022-07-31"
};
```

## Garibaldi Provincial Park

Configuration to poll for Cheakamus AM Parking on August 2, 2022
```
export default {
  "park": "Garibaldi Provincial Park",
  "name": "Cheakamus",
  "type": "Parking",
  "period": "AM",
  "date": "2022-08-02"
}
```

Configuration to poll for Rubble Creek day Parking on August 5, 2022
```
export default {
  "park": "Garibaldi Provincial Park",
  "name": "Rubble Creek",
  "type": "Parking",
  "period": "DAY",
  "date": "2022-08-05"
}
```

## Golden Ears Provincial Park

Alouette Lake Boat Launch Parking day pass for August 2, 2022

```
export default {
  "park": "Golden Ears Provincial Park",
  "name": "Alouette Lake Boat Launch Parking",
  "type": "Parking",
  "period": "DAY",
  "date": "2022-08-02"
}
```
