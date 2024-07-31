import config from "./config.js";
import fetch from "node-fetch";
import { clearInterval } from "timers";
import { playAudioFile } from "audic";

const baseApi: string = "https://jd7n1axqh0.execute-api.ca-central-1.amazonaws.com/api";

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
  }

  async hasAvailability(): Promise<Boolean> {
    const url = baseApi + `/reservation?&park=${this.config.park}&facility=` + encodeURIComponent(this.config.facility);

    const response: ReservationAPIResponse = 
      await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/127.0"
        }
      }).then(res => res.json()) as ReservationAPIResponse;

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
    if (this.config.ntfyEndpoint) {
      await fetch(this.config.ntfyEndpoint, {
        method: "POST",
        body: `Found a ${this.config.period} pass for ${this.config.facility} on ${this.config.date}, go book it now!`,
      });
    }
  }
}

function main() {
  const runner: TrailWatch = new TrailWatch();
  let tries: number = 1;

  let timer = setInterval(async () => {
    console.log(`Try #${tries}`);

    if (await runner.hasAvailability()) {
      console.log("found a spot!");
      runner.notify();
      clearInterval(timer);
    }
    tries++;
  }, 10000);
}

main();

