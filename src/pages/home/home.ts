import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { Http, Headers } from '@angular/http';
import { Config } from '../../config/config';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})

export class HomePage {

  video = '';
  url = '';
  
  //构造函数
  constructor(public toast: ToastController, public navCtrl: NavController, public navParams: NavParams,
    private http: Http
  ) { }

  //页面加载完成执行方法
  ionViewDidLoad() {
    // console.log(Config.);
    let IP = (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0);
    this.http.get("https://www.ppx26.com/videos/11608/91kk-caob-97-yoyo-1080p/", {
      headers: new Headers({ 'X-Forwarded-For': IP })
    }).subscribe(res => {
      let exp = new RegExp("video_url:.*?'([^']*)'", "");
      let match = res.text().match(exp);
      if (match) {
        console.log(match[1])
        this.video = match[1];
        alert(match[1]);
      } else {
        this.toast.create({
          message: "解析失败",
          duration: 1200
        }).present();
      }
    }, e => {
      alert('exception' + e)
    })
  }

  add() {
    console.log(this.url)
    let IP = (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0);
    this.http.get(Config.isProd ? (Config.url + this.url.split("com")[1]) : this.url, {
      headers: new Headers({ 'X-Forwarded-For': IP })
    }).subscribe(res => {
      let exp = new RegExp("video_url:.*?'([^']*)'", "");
      let match = res.text().match(exp);
      if (match) {
        console.log(match[1])
        this.video = match[1];
      } else {
        this.toast.create({
          message: "解析失败",
          duration: 1200
        }).present();
      }
    }, e => {
      alert('exception' + e)
    })
  }

  play() {
    
  }

  goppx(){
    this.navCtrl.push(SearchPage);
  }
}

