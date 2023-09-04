import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectOption } from '../../interface';

@Component({
    selector: 'input-calendar',
    templateUrl: './calendar.component.html',
})

export class InputCalendarComponent implements OnInit{
    today = new Date();
    selectedMonth = this.today.getMonth();
    selectedYear = this.today.getFullYear();
    selectedHour = this.today.getHours();
    selectedMinute = this.today.getMinutes();
    

    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    days: Array<number | null> = []
    weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    useTime = false;
    useToday = true;
    timeOnly = false;

    @Input('value') value?: Date
    @Input('max') max?: Date 
    @Input('min') min?: Date
    @Input('className') className?: string = ''
    @Input('type') type = 'date'
    @Output('nxChange') change = new EventEmitter

    get selectedMonthName(){
        return this.months[this.selectedMonth]
    }

    ngOnInit(): void {
        this.initialize()
        this.showCalendar(this.selectedMonth, this.selectedYear)
    }

    daysInMonth(month: number, year: number) {
        return 32 - new Date(year, month, 32).getDate();
    }

    initialize(){
        if(this.value instanceof Date && this.value.toString() !== 'Invalid Date'){
            this.selectedHour = this.value.getHours()
            this.selectedMinute = this.value.getMinutes()
            this.selectedMonth = this.value.getMonth()
            this.selectedYear = this.value.getFullYear()
        }
    }

    showCalendar(month: number, year: number) {
        if(this.type === 'time'){
            this.useTime = true
            this.timeOnly = true
            return
        }
        let key = `calcache-${month}+${year}`
        this.days = []
        let cache = []
        try{
            cache = JSON.parse(key)
            if(Array.isArray(cache) && cache.length){
                this.days = cache
            } 
        } catch(err){
        }
        if(!cache.length){
            let firstDay = (new Date(year, month)).getDay();
            let date = 1;
            let days = []
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        days.push(null)
                    }
                    else if (date > this.daysInMonth(month, year)) {
                        break;
                    }
        
                    else {
                        days.push(date)
                        date++;
                    }
                }
            }
            this.days = days
            sessionStorage.setItem(key, JSON.stringify(days))
        }
        

        if(this.type === 'datetime'){
            this.useTime = true
        }

        if(this.type === 'month'){
            this.useToday = false
        }
    }

    next() {
        this.selectedYear = (this.selectedMonth === 11) ? this.selectedYear + 1 : this.selectedYear;
        this.selectedMonth = (this.selectedMonth + 1) % 12;
        this.showCalendar(this.selectedMonth, this.selectedYear);
    }
    
    previous() {
        this.selectedYear = (this.selectedMonth === 0) ? this.selectedYear - 1 : this.selectedYear;
        this.selectedMonth = (this.selectedMonth === 0) ? 11 : this.selectedMonth - 1;
        this.showCalendar(this.selectedMonth, this.selectedYear);
    }

    handleSelectDay(day: number | null){
        if(day === null) return
        let date = new Date(this.selectedYear, this.selectedMonth, day, (this.value || this.today).getHours(), (this.value || this.today).getMinutes())
        this.change.emit(date)
    }

    handleSelectHour(hour: number){
        if(!this.value){
            this.handleSelectDay(this.today.getDate())
        }
        this.selectedHour = hour
        setTimeout(() => {
            let date = new Date(this.value!.getFullYear(), this.value!.getMonth(), this.value!.getDate(), hour, this.value!.getMinutes())
            this.change.emit(date)
        }, 100)
       
    }

    handleSelectMinute(min: number){
        if(!this.value){
            this.handleSelectDay(this.today.getDate())
        }
        this.selectedMinute = min
        setTimeout(() => {
            let date = new Date(this.value!.getFullYear(), this.value!.getMonth(), this.value!.getDate(), this.value!.getHours(), min)
            this.change.emit(date)
        }, 100)
    }

    getActiveDay(day: number | null): boolean{
        if(day === null){
            return false
        }
        if(!this.value){
            return false
        }
        if(this.selectedYear === this.value.getFullYear() && this.value.getMonth() === this.selectedMonth && this.value.getDate() === day){
            return true
        }
        return false
    }

    
    getDisabledDay(day: number): boolean{
        let date = new Date(this.selectedYear, this.selectedMonth, day)
        if(this.max || this.min){
            if(date > this.max!){
                return true
            }
            date.setHours(23)
            date.setMinutes(59)
            if(date < this.min!){
                return true
            }
        }
        return false
    }

    jump(type: 'MONTH' | 'YEAR', value: number) {
        if(type === 'MONTH'){
            this.selectedMonth = value;
        } else {
            this.selectedYear = value;
        }

        if(this.type === 'month'){
            let value = new Date(this.selectedYear, this.selectedMonth, 1, 0, 0)
            this.change.emit(value)
        } else {
            this.showCalendar(this.selectedMonth, this.selectedYear);
        }
    }

    
    yearOptions = this.getYearOptions()

    monthOptions: SelectOption[] = Array.from(Array(12), (_, i) => ({value: i, label: this.months[i]}))
    hourOptions: SelectOption[] = Array.from(Array(24), (_, i) => ({value: i, label: this.padNumber(i)}))
    minuteOptions: SelectOption[] = Array.from(Array(60), (_, i) => ({value: i, label: this.padNumber(i)}))

    get getTodayAccess(): boolean{
        let now = new Date(Date.now())
        if(this.max || this.min){
            return !this.getDisabledDay(now.getDate())
        } else {
            return true
        }
    }

    padNumber(value: number){
        if(value < 10){
            return `0${value}`
        } else {
            return `${value}`
        }
    }

    handleClear(){
        this.change.emit(null)
    }

    handleToday(){
        this.change.emit(new Date(Date.now()))
    }

    getYearOptions(): SelectOption[]{
        let currentYear = this.today.getFullYear()
        let maxYear = currentYear + 6;
        let minYear = currentYear - 40;
        let range = maxYear - minYear + 1
        return Array.from(Array(range), (_, i) => ({value: maxYear - i, label: `${maxYear - i}`}))
    }
}