import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Helper } from '../../../services/helper.service';

@Component({
    selector: 'input-number',
    templateUrl: './number.component.html',
})

export class InputNumberComponent{
    @Output('nxChange') change = new EventEmitter
    @Input('id') id?: string = `nm${Math.floor(Math.random() * 100)}`
    @Input('placeholder') placeholder?: string
    @Input('value') value?: string | number
    @Input('disabled') disabled: boolean = false
    valueLabel: string = '' 

    constructor(
        public helper: Helper
    ){}


    handleChange(e: Event) {
        const target = e.target as HTMLInputElement
        let value = this.helper.unformatNumber(target.value)
        this.valueLabel = target.value
        this.change.emit(value)
        setTimeout(() => {
            this.valueLabel = this.helper.formatNumber(this.valueLabel)
        })
    }

    get getValue(): string {
        return this.valueLabel || this.helper.formatNumber(this.value!)
    }
}