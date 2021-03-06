import { Component, View, NgFor, NgIf, Inject, NgClass} from 'angular2/angular2';
import { Router, RouteParams, RouterLink } from 'angular2/router';
import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Material } from '../../directives/material';
import { SessionFactory } from '../../services/session';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CARDS } from '../../controllers/cards/cards';

@Component({
  selector: 'minds-discovery',
  viewBindings: [ Client ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/discovery/discovery.html',
  directives: [ RouterLink, NgFor, NgIf, Material, InfiniteScroll, NgClass, CARDS ]
})

export class Discovery {

  _filter : string = "featured";
  _owner : string = "";
  _type : string = "all";
  entities : Array<Object> = [];
  moreData : boolean = true;
  offset: string = "";
  inProgress : boolean = false;

  constructor(public client: Client, public router: Router, public params: RouteParams, public title: MindsTitle){
    this._filter = params.params['filter'];

    switch(this._filter){
      case "all":
        break;
      case "suggested":
        this._type = "channels";
        break;
      case "trending":
        this._type = "images";
        break;
      case "featured":
        this._type = "channels";
        break;
      case "owner":
        break;
      default:
        this._owner = this._filter;
        this._filter =  this._filter;
    }

    if(params.params['type'])
      this._type = params.params['type'];

    this.title.setTitle("Discovery");

    this.load(true);
  }

  load(refresh : boolean = false){
    var self = this;

    if(this.inProgress) return false;

    if(refresh)
      this.offset = "";

    this.inProgress = true;

    var filter = this._filter;
    if(this._owner)
      filter = 'owner';

    this.client.get('api/v1/entities/'+filter+'/'+this._type+'/' + this._owner, {limit:12, offset:this.offset})
      .then((data : any) => {
        if(!data.entities){
          self.moreData = false;
          self.inProgress = false;
          return false;
        }

        if(refresh){
          self.entities = data.entities;
        }else{
          if(self.offset)
            data.entities.shift();
          for(let entity of data.entities)
            self.entities.push(entity);
        }

        self.offset = data['load-next'];
        self.inProgress = false;

       })
       .catch((e) => {
         self.inProgress = false;
       });
  }

}
