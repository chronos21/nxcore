import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Helper } from '../../../services/helper.service';
import { DateConfig } from '../../interface';

@Component({
    selector: 'input-date',
    templateUrl: './date.component.html',
})
export class InputDateComponent {
    @Output('nxChange') change =  new EventEmitter
    @Input('type') type = 'date'
    @Input('placeholder') placeholder?: string = 'Select Date'
    @Input('value') value?: string | Date
    @Input('disabled') disabled: boolean = false
    @Input('config') config: DateConfig = {};
    @Input('id') id?: string = `x${Math.floor(Math.random() * 100)}`


    calendarClassName = ''
    
    @HostListener('document:click', ['$event'])
    clickOutside($event: Event) {
        const el = $event.target as HTMLInputElement
        const isInisde = el.closest(`#dt-${this.id}`)
        if(!isInisde){
            if(el.className === 'dropdown-item') return
            this.showCalendar = false
        }
    }  

    constructor(
        private helper: Helper
    ){}
    
    showCalendar = false
    
    get getValue(){
        let val: string | Date = `${this.value}`
        if(typeof val === 'string'){
            val = new Date(val)
        }
        if(val.toString() === 'Invalid Date'){
            return ''
        }
        
        if(val instanceof Date){
            if(this.config?.format){
                return this.helper.formatDate(val, this.config.format)
            }
            if(this.type === 'datetime'){
                return this.helper.formatDate(val, 'dd/MM/yyyy HH:mm')
            } else if(this.type === 'date'){
                return this.helper.formatDate(val, 'dd/MM/yyyy')
            } else if(this.type === 'time'){
                return this.helper.formatDate(val, 'HH:mm')
            }
        }

       
        return val || ''
    }

    get getDateValue(): Date{
        if(typeof this.value === 'string' ){
            return new Date(this.value)
        } else {
            return this.value!
        }
    }

    handleChange(newValue: Date){
        this.change.emit(newValue)
        if(this.type === 'date'){
            this.showCalendar = false
        }
    }

    detectScrollHeight(){
        const el = document.querySelector(`#dt-${this.id}`)
        let className = 'top-100' 
        if (el && window.innerHeight - el.getBoundingClientRect().bottom < 250){
            className = 'bottom-100'
        } 
        if(el && window.innerWidth - el.getBoundingClientRect().right < 150){
            className += ' end-0'
        }

        this.calendarClassName = className
    }

    handleShow(){
        this.showCalendar = true
        this.detectScrollHeight()
    }

    get getConfig(): DateConfig{
        return this.config || {}
    }
}