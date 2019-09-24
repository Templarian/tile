import { LightningElement, track, wire } from 'lwc';
import { getMap } from 'services/mapService';
import { addToast, addErrorToast, addWarningToast, addLoadingToast, removeToast } from 'services/toastService';
import World from 'models/world';
import {
  mdiAccount,
  mdiMessageText,
  mdiScript,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatAlignCenter
} from '@mdi/js';

export default class App extends LightningElement {

  @track tile: any = { complex: 'object' };
  @track tileId: any = null;
  @track tileCount: number = 0;
  @track world: World = new World();
  @track mdiAccount: string = mdiAccount;
  @track mdiMessageText: string = mdiMessageText;
  @track mdiScript: string = mdiScript;
  @track mdiFormatAlignLeft: string = mdiFormatAlignLeft;
  @track mdiFormatAlignRight: string = mdiFormatAlignRight;
  @track mdiFormatAlignCenter: string = mdiFormatAlignCenter;

  @wire(getMap, { id: '$tileId' })
  function({ error, data }: any) {
    if (data) {
      this.world = new World().from(data);
      console.log(this.world.addTiles);
      removeToast(this.loadingToastId);
    }
    if (error) {
      this.world = new World();
      this.tileId = null;
      addErrorToast('Failed to load map!', 5000);
      removeToast(this.loadingToastId);
    }
  }

  addTileHandler: any;
  deleteTileHandler: any;

  constructor() {
    super();
    this.addTileHandler = this.handleAddTile.bind(this);
    this.deleteTileHandler = this.handleDeleteTile.bind(this);
  }

  connectedCallback() {
    this.addEventListener('addtile', this.addTileHandler);
    this.addEventListener('deletetile', this.deleteTileHandler);
  }

  handleAddTile(e: CustomEvent<any>) {
    const { x, y } = e.detail;
    this.world!.addTile(x, y, null);
    this.tileCount = this.world.tileCount;
  }

  handleDeleteTile(e: CustomEvent<any>) {
    this.world.removeTile(e.detail.tile);
    this.tileCount = this.world.tileCount;
    console.log('deleted');
  }

  get data() {
    return JSON.stringify(this.world.json());
  }

  loadingToastId: any;

  loadMap() {
    this.tileId = 'world';
    this.loadingToastId = addLoadingToast('Loading Map...');
  }

  loadMap2() {
    this.tileId = 'world1';
    this.loadingToastId = addLoadingToast('Loading Map...');
  }

  fireToast() {
    addToast('Toast Message');
  }

  fireToast3() {
    addToast('Toast Message 3 seconds', 3);
  }


  fireErrorToast() {
    addErrorToast('Toast Error Message');
  }

  fireWarningToast() {
    addWarningToast('Toast Warning Message');
  }

}
