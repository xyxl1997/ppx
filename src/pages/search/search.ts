import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController, ModalController } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading/loading';
import { Http, Headers } from '@angular/http';
import { Config } from '../../config/config';
import { PlayPage } from '../play/play';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
    providers: []
})

export class SearchPage {

    searchText = '';
    page = 1;
    list = [];
    //构造函数
    constructor(public toast: ToastController, public navCtrl: NavController, public navParams: NavParams,
        private http: Http, private loading: LoadingProvider, public modal: ModalController
    ) { }

    //页面加载完成执行方法
    ionViewDidLoad() {
        // console.log(Config.);

    }
    clickSearch() {
        this.loading.showLoading("加载中");
        this.http.get(Config.url + '/search/' + this.searchText + '/', {
            params: {
                mode: 'async',
                function: 'get_block',
                block_id: 'list_videos_videos_list_search_result',
                q: this.searchText,
                category_ids: '',
                sort_by: 'post_date',
                from_videos: this.page,
                from_albums: this.page,
                _: new Date().getTime(),
            }
        }).subscribe(res => {
            this.loading.hideLoading();
            let exp = new RegExp('<a.*data-rt(.|\n)*?</a>', 'g');
            let match = res.text().match(exp);
            if (!match) {
                this.toast.create({
                    message: "暂无数据 嘤嘤嘤~",
                    duration: 1200
                })
                return;
            }
            match.forEach(v => {
                let exp = new RegExp(`href=("|')(.*)("|').*title=("|')(.*)("|').*data-rt(.|\n)*<img.*data-original=("|')(.*?)("|')`);
                let data = v.match(exp);
                this.list.push({
                    video: data[2],
                    title: data[5],
                    image: data[9]
                })
            })
        })
    }

    goPlay(video) {
        this.loading.showLoading("加载中");
        let IP = (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0) + "." + (Math.random() * 255).toFixed(0);
        this.http.get(Config.isProd ? (Config.url + video.split("com")[1]) : video, {
            headers: new Headers({
                'x-forwarded-for': IP,
            }),
        }).subscribe(res => {
            this.loading.hideLoading();
            let exp = new RegExp("video_url:.*?'([^']*)'", "");
            let match = res.text().match(exp);
            if (match) {
                console.log(match[1]);
                // this.navCtrl.push(PlayPage, { video: match[1] })
                this.modal.create(PlayPage, { video: match[1] }).present();

            } else {
                this.toast.create({
                    message: '地址解析失败',
                    duration: 1200
                }).present();
            }
        })
    }
}

