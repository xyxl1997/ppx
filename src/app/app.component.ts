import { Component } from '@angular/core';
import { Platform, IonicApp, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
// import { AppUpdate } from '@ionic-native/app-update';

@Component({
  selector: 'app-index',
  templateUrl: 'app.html',
})
export class MyApp {

  rootPage: any = TabsPage;

  constructor(platform: Platform, app: App, private alertCtrl: AlertController, statusBar: StatusBar, splashScreen: SplashScreen, ionicApp: IonicApp) {

    platform.ready().then(_ => {
      statusBar.styleDefault();
      splashScreen.hide();

      //注册返回按键事件
      platform.registerBackButtonAction(_ => {

        let activePortal = ionicApp._loadingPortal.getActive() || ionicApp._modalPortal.getActive() || ionicApp._toastPortal.getActive() || ionicApp._overlayPortal.getActive();

        if (activePortal) { activePortal.dismiss(); return; }

        let nav = app.getActiveNav()

        if (nav.canGoBack()) {
          nav.pop()
        }
        else {
          this.showExit(platform);
        }

      }, 1);
    });
  }

  showNetWorkErrror() {
    this.alertCtrl.create({
      title: '网错误',
      message: '请检查你的网络，以及应用是否具有访问网络的权限~',
      buttons: [
        {
          text: '确认',
          handler: () => { }
        }
      ]
    }).present();
  }

  showExit(platform) {
    this.alertCtrl.create({
      title: '退出应用',
      message: '请问您要退出应用吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '退出',
          handler: () => {
            platform.exitApp();
          }
        }
      ]
    }).present();
  }

}


