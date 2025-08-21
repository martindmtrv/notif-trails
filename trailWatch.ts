import config from "./config.js";
import fetch from "node-fetch";
import { clearInterval } from "timers";
import { playAudioFile } from "audic";

//const baseApi: string = "https://jd7n1axqh0.execute-api.ca-central-1.amazonaws.com/api";
const baseApi: stirng = "https://d757dzcblh.execute-api.ca-central-1.amazonaws.com/api";

type Period = "DAY" | "AM" | "PM";

interface Config {
  park: string;
  facility: string;
  date: string;
  period: Period;
  ntfyEndpoint?: string;
}

interface ReservationAPIResponse {
  [date: string]: {
    [period in Period]: {
      capacity: 'Low' | 'Full';
      max: number;
    };
  },
}

interface FacilityAPIResponse {
  name: string;
  bookingTimes: {
    DAY?: {
      max: number
    },
    AM?: {
      max: number
    },
    PM?: {
      max: number
    }
  },
  reservations: ReservationAPIResponse,
  type: string
};

class TrailWatch {
  private config: Config;

  constructor() {
    this.config = config as Config;
    console.log(config);
  }

  async hasAvailability(): Promise<Boolean> {
    const url = baseApi + `/reservation?facility=${this.config.facility}&park=${this.config.park}`;
    console.log(url);
    const response: ReservationAPIResponse = 
      await fetch(url, {
        headers: {
         "User-Agent": "Firefox",
         "Accept": "application/json"
        }
      }).then(res => {
        console.log(res.status);
        return res.json()
      }) as ReservationAPIResponse;
    //console.log(response);

    try {
      const spotsForDate = response[this.config.date];
      
      if (!spotsForDate) {
        console.warn("Current date is not available for booking. This may be intentional if you are scraping before the spots first open up");
        return false;
      }
      const spots = spotsForDate[this.config.period];

      return spots.capacity !== "Full" && spots.max > 0;
    } catch(e: any) {
      console.error(e);
      throw new Error("Unknown API Response");
    }
  }
  
  async notify(): Promise<void> {
    await playAudioFile("notifSound.wav");
    console.log("send notif");
    if (this.config.ntfyEndpoint) {
      await fetch(this.config.ntfyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: `Found a ${this.config.period} pass for ${this.config.facility} on ${this.config.date}, go book it now!`}),
      });
    }
  }
}

async function main() {
  const runner: TrailWatch = new TrailWatch();
  let tries: number = 1;

  let timer = setInterval(async () => {
    console.log(`Try #${tries}`);

    try {
      
      if (await runner.hasAvailability()) {
        console.log("found a spot!");
        await runner.notify();
        //clearInterval(timer);
      }
    } catch (e) {
      console.error(e);
      console.log("something went wrong");
    }
    tries++;
  }, 60000);
}

main();
