import { Component, CORE_DIRECTIVES, EventEmitter, ElementRef } from 'angular2/angular2';

@Component({
  selector: 'google-ad',
  template: `
    <ins
      *ng-if="visible"
      class="adsbygoogle"
       style="display:block; width:100%;"
       data-ad-client="ca-pub-9303771378013875"
       data-ad-slot="7588308825"
       data-ad-format="auto"
       data-ad-test="on"
       ></ins>
  `,
  directives: [ CORE_DIRECTIVES ],
  host: {
    'class': 'm-ad-block m-ad-block-google'
  }
})

export class GoogleAds{

  visible : boolean = false;

  constructor(element : ElementRef) {
    GoogleAdsService.load().then(() => {
      this.visible = true;
      console.log('ads ready to show');
    });
  }

  onDestroy(){
    GoogleAdsService.unload();
  }

}

class GoogleAdsService{

  static script;

  static load(){
    return new Promise((resolve) => {
      if(!GoogleAdsService.script){
        GoogleAdsService.script = document.createElement('script');
        GoogleAdsService.script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        GoogleAdsService.script.async = true;
        document.body.appendChild(GoogleAdsService.script);
        resolve(true);
      } else {
        resolve(true);
      }
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  static unload(){
    if(GoogleAdsService.script){
      GoogleAdsService.script.remove();
      GoogleAdsService.script = null;
    }
  }
}
