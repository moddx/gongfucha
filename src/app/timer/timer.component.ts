import { Component, OnInit } from '@angular/core';
import { interval, Subscription, zip } from 'rxjs';
import {Howl, Howler} from 'howler';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  time: number = 0;
  initialInfusionTime = 20;
  brewTimeIncrement: number = 5;
  lastInfusionTime?: number;

  infusionsTarget = 8;
  infusions = 0;

  running = false;

  timerSubscription?: Subscription;

  soundEnabled = true;
  soundVolume = 0.75;
  notificationSound!: Howl;
  availableSounds = [
    {name: 'Glass Ping', path: 'glass_ping-Go445-1207030150.mp3', author: 'Go445', source: 'https://soundbible.com/2084-Glass-Ping.html'},
    {name: 'Analog Watch Alarm', path: 'analog-watch-alarm_daniel-simion.mp3', author: 'Daniel Simion', source: 'https://soundbible.com/2197-Analog-Watch-Alarm.html'},
    {name: 'Bike Horn', path: 'Bike Horn-SoundBible.com-602544869.mp3', author: 'StickInTheMud', source: 'https://soundbible.com/1446-Bike-Horn.html'},
    {name: 'Dixie Horn', path: 'dixie-horn_daniel-simion.mp3', author: 'Daniel Simion', source: 'https://soundbible.com/2179-Dixie-Horn.html'},
    {name: 'Door Bell', path: 'Door Bell-SoundBible.com-1986366504.mp3', author: 'Mike Koenig', source: 'https://soundbible.com/165-Door-Bell.html'},
    {name: 'Door Bell II', path: 'Doorbell-SoundBible.com-516741062.mp3', author: 'bennstir', source: 'https://soundbible.com/1466-Doorbell.html'},
    {name: 'Door Bell (Old fashioned)', path: 'old-fashioned-door-bell-daniel_simon.mp3', author: 'Daniel Simion', source: 'https://soundbible.com/2160-Old-Fashion-Door-Bell.html'},
    {name: 'Foghorn', path: 'foghorn-daniel_simon.mp3', author: 'Daniel Simon', source: 'https://soundbible.com/2142-FogHorn-Barge.html'},
    {name: 'Front Desk Bell', path: 'front-desk-bells-daniel_simon.mp3', author: 'Daniel Simion', source: 'https://soundbible.com/2190-Front-Desk-Bell.html'},
    {name: 'Music Box', path: 'Music_Box-Big_Daddy-1389738694.mp3', author: 'Big Daddy', source: 'https://soundbible.com/1619-Music-Box.html'},
    {name: 'Steam Train Whistle', path: 'steam-train-whistle-daniel_simon.mp3', author: 'Daniel Simion', source: 'https://soundbible.com/2177-Steam-Train-Whistle.html'},
  ]
  selectedSound = this.availableSounds[0];

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.reset();
    this.notificationSound = this.howlOf(this.selectedSound.path);
  }

  volumeChanged() {
    this.notificationSound.volume(this.soundVolume);
  }

  howlOf(path: string) {
    const howl = new Howl({
      src: ['assets/notificationSounds/' + path]
    });
    howl.volume(this.soundVolume);
    return howl;
  }

  timeParamChange(event: any) {
    if (this.running) return;
    if (!this.lastInfusionTime) {
      console.log(`called ${this.initialInfusionTime}`);
      this.time = this.initialInfusionTime;
      return;
    }
    this.time = this.lastInfusionTime + this.brewTimeIncrement;
  }

  soundChanged(event: MatOptionSelectionChange) {
    if (!event.isUserInput) return;
    console.log(`Changing sound to ${event.source.value.name}`);
    this.selectedSound = event.source.value;
    this.notificationSound = this.howlOf(event.source.value.path);
  }

  async run(event: any) {
    if (this.running) return;

    this.running = true;
    this.infusions += 1;

    const currentTime = this.currentTime();
    this.time = currentTime;

    this.timerSubscription = interval(1000).subscribe((_x) => {
      if (this.time > 0) {
        this.time -= 1;
      } else {
        this.timerSubscription?.unsubscribe();
        this.running = false;
        this.lastInfusionTime = currentTime;
        this.time = this.lastInfusionTime! + this.brewTimeIncrement;
        if(this.soundEnabled) {
          this.notificationSound.play();
        }
        this._snackBar.open('Brew is ready!', '🎉', {duration: 2500, verticalPosition: 'top'})
      }
    });
  }

  abort(event: any) {
    if (!this.running) return;

    this.timerSubscription?.unsubscribe();
    this.running = false;
    this.time = this.currentTime();
    this.infusions -= 1;
    this.notificationSound.stop();
  }

  currentTime() {
    return !this.lastInfusionTime
      ? this.initialInfusionTime
      : this.lastInfusionTime + this.brewTimeIncrement;
  }

  progressType() {
    if (this.infusions >= this.infusionsTarget) return 'success';
    if (this.infusions < this.infusionsTarget / 2) return 'warning';
    return 'info';
  }

  reset() {
    this.infusions = 0;
    this.time = this.initialInfusionTime;
    this.running = false;
  }
}
