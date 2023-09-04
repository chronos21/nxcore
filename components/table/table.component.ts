import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { SelectOption, StdObject, TableConfig } from '../../interface';
import { Helper } from '../../services/helper.service';

@Component({
    selector: 'nx-table',
    templateUrl: './table.component.html',
})

export class TableComponent {
    constructor(
        public helper: Helper
    ){}

    @Output('pageChange') public pageChange = new EventEmitter
    @Output('limitChange') public limitChange = new EventEmitter

    @Input('customClass') customClass: string = ''
    @Input('dataPerPage') dataPerPage: number = 20;

    @Input('pageCurrent') pageCurrent: number = 1;
    @Input('pageTotal') pageTotal: number = 1;
    @Input('maxPage') maxPage: number = 3
    @Input('dataTotal') dataTotal: number = 3
    @Input('config') config: TableConfig[] = []

    @Input('data') data: StdObject[] = []
    @Input('sortValue') sortValue: StdObject = {}
    @Input('handleSort') handleSort: Function = (value: string | null) => {}
    @Input('detailUrl') detailUrl: string = ''
    @Input('useActionColumn') useActionColumn: boolean = true
    @Input('usePagination') usePagination: boolean = true
	@ContentChild('customAction') customAction?: TemplateRef<any>;
	@ContentChild('customCell') customCell?: TemplateRef<any>;

    @Input('limitDataLength') limitDataLength: boolean = true;

    
    handlePage(page: number){
        this.pageChange.emit(page)
    }

    handleLimitChange(value: number){
        this.limitChange.emit(value)
    }

    perPageOptions: SelectOption[] = [
        {
            value: 20, label: '20'
        },
        {
            value: 40, label: '40'
        },
        {
            value: 80, label: '80'
        },
        {
            value: 100, label: '100'
        }
    ]

    numberToArray(num: number){
        let start = this.pageCurrent - 1 || 1
        const end = this.pageTotal
        const arr: number[] = []
        for(let i = 0; i < num; i++){
            let page = i + start
            if(page <= end){
                arr.push(page)
            } else{
                start = start - 1
                page = start
                if(page > 0){
                    arr.unshift(page)       
                }
            }
        }

        return arr
         
    }

    get disableNext(){
        return this.pageCurrent === this.pageTotal
    }

    getDetailUrl(item: StdObject): string{
        return `${this.detailUrl}/${item['id']}`
    }

    get renderFrom(): number {
        let from = (this.pageCurrent -  1) * this.dataPerPage + 1
        if(from > this.dataTotal){
            from = this.dataTotal
        }
        return from
    }

    get renderTo(): number {
        let to = ((this.pageCurrent - 1) * this.dataPerPage) + this.dataPerPage
        if(to > this.dataTotal){
            to = this.dataTotal
        }
        return to
    }

    get getExtraTableClass(): string {
        if(!this.limitDataLength){
            return 'align-top no-ellipsis' 
        } 
        return ''
    }
}