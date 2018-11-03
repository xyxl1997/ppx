import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController, ViewController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { Http, Headers } from '@angular/http';
import { Config } from '../../config/config';

@Component({
    selector: 'page-play',
    templateUrl: 'play.html',
    providers: []
})

export class PlayPage {

    video = "";
    
    //构造函数
    constructor(public toast: ToastController, public viewCtrl: ViewController,
        private http: Http, private loading: LoadingProvider,public navParams : NavParams
    ) { 
        this.video = navParams.get("video");
    }

    //页面加载完成执行方法
    ionViewDidLoad() {
        
    }
}

