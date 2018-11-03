import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoadingProvider {

  constructor(public loadingCtrl: LoadingController) { }

  showLoading(message: string) {
    this.loader = this.loadingCtrl.create({ content: message, dismissOnPageChange: false })
    this.loader.present();
  }

  hideLoading() {
    try {
      if (!!this.loader) {
        this.loader.dismissAll()
        this.loader = null
      }
    }
    catch (e) {
      console.log(e.toString())
    }
  }

  private loader: Loading

}
