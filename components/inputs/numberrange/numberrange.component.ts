import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'input-numberrange',
    templateUrl: './numberrange.component.html',
})

export class InputNumberRangeComponent{
    @Output('nxChange') change =  new EventEmitter
    @Input('id') id?: string = `nmr${Math.floor(Math.random() * 100)}`
    @Input('placeholderFrom') placeholderFrom?: string = 'From'
    @Input('placeholderTo') placeholderTo?: string = 'To'
    @Input('value') value: any = {}

    handleDataChange(value?: number, type: 'from' | 'to' = 'from') {
        let from = this.value?.from || '' 
        let to = this.value?.to || ''
        if(value === undefined){
            return
        }
        if(type === 'from'){
            from = value
        } else if(type === 'to'){
            to = value
        }
        this.change.emit({from, to})
    }

    getValue(key: 'from' | 'to'){
        try {
            return this.value[key]
        } catch (err) {
            return ''
        }
    }
}
