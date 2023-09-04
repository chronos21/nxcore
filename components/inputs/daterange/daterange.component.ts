import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateConfig } from '../../interface';
@Component({
    selector: 'input-daterange',
    templateUrl: './daterange.component.html',
})

export class InputDateRangeComponent{
    @Output('nxChange') change =  new EventEmitter
    @Input('placeholderStart') placeholderStart?: string = 'Start'
    @Input('placeholderEnd') placeholderEnd?: string = 'End'
    @Input('config') config: DateConfig = {}
    @Input('value') value: any = {}
    @Input('id') id?: string = `dtr${Math.floor(Math.random() * 100)}`

    handleDateChange(value: Date, type: 'start' | 'end' = 'start') {
        let start = this.value?.start 
        let end = this.value?.end
        if(value === undefined){
            return
        }
        if(type === 'start'){
            start = value
        } else if(type === 'end'){
            end = value
        }
        this.change.emit({start, end})
    }

    get getStartConfig(): DateConfig{
        return {
            ...this.config,
            max: this.value?.end || this.config.max,
        }
    }

    get getEndConfig(): DateConfig{
        return {
            ...this.config,
            min: this.value?.start || this.config.min
        }
    }
}