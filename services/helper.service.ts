import { Injectable } from "@angular/core";
import { Toast } from "./toast.service";
import { StdObject } from "../interface";
import { formatDate as fd } from "@angular/common";

@Injectable()
export class Helper {
	constructor(
		public toast: Toast
	){}

    formatDateFilter(date: string | Date | undefined, isEnd = false){
		if(!date) return null
		if(typeof date === 'string'){
			date = new Date(date)
		}
		if(isEnd){
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
		} else {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
		}
	}

	formatDate(date: string | Date | undefined, format = 'dd/MM/yyyy'): string{
		if(!date) return ''
		if(typeof date === 'string'){
			date = new Date(date)
		}
		if(date?.toString() === 'Invalid Date'){
			return ''
		} 
        return fd(date, format, 'en')
    }

	formatDateTime(date: string | Date | undefined): string{
		return this.formatDate(date, 'dd/MM/yyyy HH:mm:ss')
    }

	formatNumber(value: string | number | null): string{
        if(value === '' || value === null){
            return ''
        }
        value = this.unformatNumber(value)
        return value.toLocaleString('id-ID')
    }

    unformatNumber(value: string | number): number | string {
        if(typeof value === 'string'){
            value = value.replace(/\D/g, '')
            value = parseInt(value)
        }
        if(isNaN(value)){
            return ''
        }
        return value        
    }

	getMonths() {
		let months: any = []
		let date = new Date()

		for(let i = 0; i < 12; i++) {
			date.setMonth(i)
			months.push(this.formatDate(date, 'MMMM'));
		}

		return months
	}

	getTimezoneName(): string {
		return Intl.DateTimeFormat().resolvedOptions().timeZone
	}

    getTimezoneOffset(): number{
		let offset = new Date().getTimezoneOffset()
		let value = Math.abs(offset)
		if(offset > 0){
			value = value * -1 
		}
		return value
	}

	objectToArray(obj: StdObject): any[]{
		return Object.keys(obj).map(key => obj[key])
	}

	scrollToTop(){
		window.scrollTo(0,0)
	}
	
	timeStringToDate(timeString: string): Date{
		const spliceEnd = timeString.split(':')
		const appendTime = new Date().setHours(Number(spliceEnd[0]), Number(spliceEnd[1]), 0)
		return new Date(appendTime)
	}

	showSuccessToast(message: string = 'Data has been updated!'){
		this.toast.show({
			title: 'Success',
			body: message
		})
	}

	showErrorToast(message: string = 'Unknown error. Please contact our support!'){
		this.toast.show({
			title: 'Error',
			body: message
		})
	}
}
