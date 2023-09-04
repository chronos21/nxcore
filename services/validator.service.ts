import { Injectable } from "@angular/core"
import { StdObject, ValidateObject, ValidationConfig, ValidationType } from "../interface";

@Injectable()
export class Validator {
    validate(data: ValidateObject[]): StdObject{
		const err: StdObject = {}

		data.forEach(item => {
            item.validation.forEach((type: ValidationType | ValidationConfig) => {
                const getValidate = this.handler(item.value, item.label, type);

                if (!getValidate['status']){
                    err[item['field']] = getValidate['message'];
                }
            });
        });

		return err;
	}

    handler(value: any, label: string, validation: ValidationType | ValidationConfig){
		let type: ValidationType
		let validationValue: string | number = ''
		let validationText = ''
		
		if(typeof validation === 'string' ){
			type = validation
		} else {
			type = validation.type
			validationValue = validation.value!
			validationText = validation.text!
		}

		const result = {
			'status' : true,
			'message' : '',
		};

		if (type === 'maxInt'){
			if (Number(value) > 99999999999){
				result.message = label + ': Max value for this field is 99.999.999.999';
			}
		} else if (type === 'required'){
			if (!this.isRequired(value)){
				result.message = label + ' is required.';
			}
		} else if (type === 'email'){
			if (!this.isEmail(value)){
				result.message = label + ' have wrong format.';
			}
		} else if (type === 'number'){
			if ((value ?? '').toString() !== '' && !this.isNumber(value)){
				result.message = label + ' must be number only.';
			}
		} else if (type === 'table'){
			if (!this.isArray(value)){
				result.message = label + ' cannot be empty.';
			}
		} else if (type === 'link'){
			if (!this.isUrl(value)){
				result.message = label + ' have wrong url format.';
			}
		} else if (type === 'max' && typeof validationValue === 'number'){
			if(!this.isMax(value, validationValue)){
				result.message = `Maximal value for ${label} is ${validationValue}.`
			}
		} else if (type === 'min' && typeof validationValue === 'number'){
			if(!this.isMin(value, validationValue)){
				result.message = `Minimum value for ${label} is ${validationValue}.`
			}
		} else if (type === 'equal'){
			if(value !== validationValue){
				result.message = `The value for ${label} must be "${validationValue}."`
			}
		} else if (type === 'unequal'){
			if(value === validationValue){
				result.message = `The value for ${label} must not be "${validationValue}."`
			}
		} else if (type === 'maxLength' && typeof validationValue === 'number'){
			if(value.length > validationValue){
				result.message = `The value for ${label} cannot be more than ${validationValue} characters.`
			}
		} else if (type === 'minLength' && typeof validationValue === 'number'){
			if(value.length < validationValue){
				result.message = `The value for ${label} must be more than ${validationValue} character(s).`
			}
		}

		if(result.message){
			if(validationText){
				result.message = validationText
			}
			result.status = false
		}

		return result;
	}

    isEmail(value: string) {
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(String(value).toLowerCase());
	}

	isRequired(value: string | number | undefined) {
		if(value === 0) return true
		if (!value || value === undefined || value === '') { return false; }
		return true;
	}

	isNumber(value: number) {
		if (!value.toString().match(/^[0-9]+(\.?[0-9]+)?$/)){return false;}
		return true;
	}

	isArray(array: Array<any> | undefined) {
		if (!array || array === undefined || array === null || array.length === 0) {return false;}
		return true;
	}

	isUrl(value: string | null) {
		const pattern = new RegExp('(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?');

		if ((value === null || value === '') || pattern.test(value)) { return true; }

		return false;
	}

	isMax(value: number, maxValue: number){
		if(value > maxValue){
			return false
		} else {
			return true
		}
	}

	isMin(value: number, minValue: number){
		if(value < minValue){
			return false
		} else {
			return true
		}
	}
}