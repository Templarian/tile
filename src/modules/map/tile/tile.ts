import { LightningElement, track, api } from 'lwc';
import TileCls from 'models/tile';
import { addToast } from 'services/toastService';
import Layer from 'models/layer';
import {
    mdiDelete,
    mdiPencil,
    mdiCommentRemove
} from '@mdi/js';

export default class Tile extends LightningElement {

    @track isLoading: boolean = true;
    @track mdiCommentRemove: string = mdiCommentRemove;
    @track mdiDelete: string = mdiDelete;
    @track mdiPencil: string = mdiPencil;

    @api tile: TileCls = new TileCls();
    @api hash: string = '';

    get x() {
        return this.tile.coordinate[0];
    }

    get y() {
        return this.tile.coordinate[1];
    }

    get computedClass() {
        return 'tile';
    }

    renderedCallback() {
        const [x, y] = this.tile.gridCoordinate || [0, 0];
        const ele = this.template.host as HTMLElement;
        ele.style.setProperty('--column', `${x}`);
        ele.style.setProperty('--row', `${y}`);
    }

    handleClick() {
        console.log(this.tile);
    }

    handleDelete() {
        alert('delete');
        console.log('testing');
    }

    @track openDeleteComment = false;
    handleComment() {
        this.openDeleteComment = true;
    }

    cancelDeleteComment() {
        this.openDeleteComment = false;
    }

    confirmDeleteComment() {
        this.tile.comment = '';
        this.openDeleteComment = false;
        addToast('Deleted Comment', 3);
    }

    tileWallHandler(e: MouseEvent) {
        const ele = e.currentTarget as HTMLElement;
        const layer = new Layer();
        layer.id = 'wall-inner-left-1';
        layer.file = 'wall-inner-left-1';
        this.tile.layers.push(layer);
        console.log(ele.dataset.wall)
        // call update
        this.dispatchEvent(new CustomEvent('updatetile', {}));
    }

    @track insideActive: boolean = true;
    handleToggleInside(e: MouseEvent) {
        this.insideActive = true;
        this.outsideActive = false;
        e.stopPropagation();
    }

    @track outsideActive: boolean = false;
    handleToggleOutside(e: MouseEvent) {
        this.insideActive = false;
        this.outsideActive = true;
        e.stopPropagation();
    }

    @track modalOpen: boolean = false;
    handleEditComment(e: MouseEvent) {
        this.modalOpen = true;
    }

    updateComment(e: any) {
        console.log(e.detail);
    }

    submitComment(e: CustomEvent) {
        const { inputs } = e.detail;
        this.tile.comment = inputs.find((input: any) => input.name === 'comment').value;
        this.modalOpen = false;
    }
}