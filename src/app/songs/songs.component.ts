import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Song } from '../services/artist';
import { GetDataService } from '../services/getData.service';

@Component({
  selector: 'ngSpotify-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit, OnDestroy {
  totalSongs: number = 0;
  totalTime: number = 0;
  minutes = 0;
  seconds = 0;
  paramsSubscription!: Subscription;
  curentAlbum!: string;
  albumSongs!: Song[];

  constructor(private route: ActivatedRoute, private data: GetDataService) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.curentAlbum = params['name'];
      this.albumSongs = [];
      this.totalTime = 0;
      this.albumSongs = this.data.getSongs(this.curentAlbum);
      console.log(this.curentAlbum);
      console.log(this.albumSongs);

      for (let i = 0; i < this.albumSongs?.length; i++) {
        let parts = this.albumSongs[i].length
          .split(':')
          .map((x) => parseInt(x, 10));
        this.totalTime += parts[0] * 60 + parts[1];
      }
      this.totalSongs = this.albumSongs.length;
      this.minutes = Math.floor(this.totalTime / 60);
      this.seconds = this.totalTime % 60;
    });
  }

  addFavorite(i: number) {
    if (this.albumSongs != undefined) {
      this.albumSongs[i].favorite = !this.albumSongs[i].favorite;
      console.log(this.albumSongs[i].favorite);
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
