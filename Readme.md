# Notif-trails

This is a scraper for BC Parks daypass availability. Made since there is no way to waitlist for daypasses to visit beautiful BC trails. This script will let you know if someone cancels their pass or another spot opens up so you can quickly reserve a pass for yourself. 

This script **WILL NOT** book the daypass for you. It is simply used to notify in case of spots opening up. Automatic booking cannot be done due to captcha requirements.

By default, the script will just play an audio on your computer when a spot opens up. If you want to get a mobile push notification as well, you can specify a valid ntfy url.

Setup the `config.js` for the day, pass type, and park you want to visit and run with `yarn start`. The script will poll the API every 10s until a spot opens up and it will then play a notification sound on your computer!

# Install and Run

- install modules with `bun install`
- modify the `config.js`
- run the system `bun run start start`

# Configuration

A sample configuration is included to override the fields for your use case. The fields can all be found by doing inspect element on the pass booking page and checking the requests made to /api/reservation

`"park"` this is a newly added field. It is a 4 digit "secret" number that represents the park. You can find it under the network tab after `park=`

`"facility"` field with the park you are looking for. You need to copy this exactly from the BCParks daypass site to ensure the correct API call is made. It should match exactly the what follows the `facility=` in the /api/reservation api call

`"period"` should be defined for which time period you would like to book for. Different parks provide different values for example Joffre Lakes only allows full day passes so the value should be DAY. Some parks allow for AM or PM booking too. This comes from the blocks after the dropdown is selected.

`"date"` specifies the day you want to poll for. it is in the format "YYYY-MM-DD". You can't poll for days that are more than 2 days away, since the passes only become available 2 days before at 7am.

`"ntfyEndpoint"` is an optional field. It is used to specify a ntfy url for mobile push notifications. You can use ntfy.sh or your own self hosted instance . Find out more [here](https://ntfy.sh/)

# Copy paste configurations

Use these cookie cutter examples for the parks available in 2024.

## Joffre Lakes - 0363

Configuration to poll for day passes on July 31, 2024. Copy this and change the date to the one you'd like

```
export default {
    "park": "0363",
    "facility": "Joffre Lakes",
    "period": "DAY",
    "date": "2024-07-03",
};
```

## Garibaldi Provincial Park - 0007

Configuration to poll for Cheakamus AM Parking on August 2, 2024
```
export default {
  "park": "0007",
  "name": "Cheakamus",
  "period": "AM",
  "date": "2024-08-02"
}
```

Configuration to poll for Rubble Creek day Parking on August 5, 2024
```
export default {
  "park": "0007",
  "name": "Rubble Creek",
  "period": "DAY",
  "date": "2024-08-05"
}
```


