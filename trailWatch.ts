import config from "./config.js";
import fetch from "node-fetch";
import { clearInterval } from "timers";
import {playAudioFile} from "audic";

const baseApi: string = "https://jd7n1axqh0.execute-api.ca-central-1.amazonaws.com/api";

interface FacilityAPIResponse {
  name: string;
  bookingTimes: {
    DAY: {
      max: number
    }
  },
  reservations: {
    [date: string]: {
      DAY: number
    }
  },
  type: string
};

class TrailWatch {
  private park: string;
  private date: string;
  private type: string;
  private name: string;
  private period: string;

  constructor() {
    this.park = config.park;
    this.date = config.date;
    this.type = config.type;
    this.name = config.name;
    this.period = config.period;

    if (this.park == null || this.date == null || this.type == null || this.name == null || this.period == null) {
      throw new Error("Invalid config");
    }
  }

  async hasAvailability(): Promise<Boolean> {
    const response: FacilityAPIResponse[] = 
      await fetch(baseApi + "/facility/?facilities=true&park=" + encodeURIComponent(this.park))
        .then(res => res.json()) as FacilityAPIResponse[];

    try {
      const result: FacilityAPIResponse = response.find((el) => el.name === config.name && el.type === config.type);
      const maxSpots: number = result.bookingTimes[this.period].max;

      const spots: number = result.reservations[this.date][this.period];

      return spots === undefined || spots < maxSpots;
    } catch(e: any) {
      console.error(e);
      throw new Error("Unknown API Response");
    }
  }
  
  async notify(): Promise<void> {
    await playAudioFile("notifSound.wav");
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

