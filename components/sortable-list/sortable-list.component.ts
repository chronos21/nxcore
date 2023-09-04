import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
	selector: 'nx-sortable-list',
	templateUrl: './sortable-list.component.html',
})
export class InputSortableListComponent{
    @Input('data') data: any[] = []
    @Input('disabled') disabled: boolean = false
    @Input('labelField') labelField: string = 'label'
    @Output('change') private change = new EventEmitter();
	@ContentChild('suffix') suffix?: TemplateRef<any>;

	draggingIndex?: number;

    reorderItem(fromIndex: number, toIndex: number): void {
		let newData = [...this.data]
        const itemToBeReordered = newData.splice(fromIndex, 1)[0];
		newData.splice(toIndex, 0, itemToBeReordered);
		this.draggingIndex = toIndex;
        this.change.emit(newData)
	}

	onDragStart(index: number): void {
		if(this.disabled) return
		this.draggingIndex = index;
	}

	onDragEnter(index: number): void {
		if(this.disabled) return
		if (this.draggingIndex !== index) {
			this.reorderItem(this.draggingIndex!, index);
		}
	}

	onDragEnd(): void {
		if(this.disabled) return
		this.draggingIndex = undefined;
	}    

	onDragOver(e: any): void{
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}
}