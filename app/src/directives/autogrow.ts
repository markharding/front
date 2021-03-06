import { Directive,  EventEmitter, ElementRef } from 'angular2/angular2';

@Directive({
  selector: '[auto-grow]',
  inputs: ['autoGrow', 'for'],
  host: {
    '(keydown)': 'grow()',
    '(paste)': 'grow()'
  }
})


export class AutoGrow{

  _listener : Function;
  _element : any;

  constructor(element: ElementRef) {

    this._element =  element.nativeElement;
    setTimeout(()=>{
      this.grow();
    });
  }

  grow(){
    this._element.style.overflow = 'hidden';
  //  if(!this._element.style.height)
    this._element.style.height = 'auto';
    this._element.style.height = this._element.scrollHeight + "px";
  }

  set autoGrow(value){

  }

}
