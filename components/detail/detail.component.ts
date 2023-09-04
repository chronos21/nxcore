import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router"
import { Breadcrumb, FormConfig, FormOptions, InputType, PhoneCodeConfig, StdObject, Tab, ValidateObject } from "../../interface"
import { Helper } from '../../services/helper.service';
import { Validator } from '../../services/validator.service';

@Component({
    selector: 'nx-detail',
    templateUrl: './detail.component.html',
})

export class DetailComponent {
	@Input('props') props!: BaseDetail 
	@Input('useForm') useForm: boolean = true
    @ContentChild('form') form?: TemplateRef<any>
}

let timeout: ReturnType<typeof setTimeout>
export class BaseDetail {
    constructor(
        public repository: any,
        public router: Router,
        public helper: Helper,
        public route?: ActivatedRoute,
    ){}

    paramId = this.route?.snapshot.paramMap.get('id')
    formValue: StdObject = {}
    formConfig: FormConfig = {}
    formOptions: FormOptions = {}; 
    submittedForms: string[] = ['CONTENT']
    formInvalidFields: StdObject = {}
    
    useTab = true
    tabs: Tab[] = [
        { value: 'CONTENT', name: this.paramId === 'add' ? 'FORM' : 'DETAIL' },
    ]
    
    formLayout: StdObject = {
        'CONTENT': ['CONTENT']
    }

    activeTab: string = this.tabs[0]['value'];
    errMessage: string[] = []

    isLoading = false
    disabled = false
    isChanged = false

    title: string = ''
    breadcrumb: Breadcrumb[] =  []

    afterCreateNavigate = window.location.pathname.replace('/add', '')

    validator = new Validator() 

    useCancelButton = true

    initialize(callback?: Function): void{
        this.isLoading = true
        this.getData()
            .then(() => {
                if(callback){
                    callback()
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                this.isLoading = false
                this.disabled = true
            })
    }

    async getData(){
        const data = await this.repository.detail(this.paramId)
        this.formValue = this.modifyValue(data);
    }

    modifyValue(data: StdObject): StdObject{
		return data
	}

    async handleChange(field: string, e: any, type?: InputType){
        let value = e; 
        if(e?.target){
            value = e.target.value
        }
        
        if(type === 'checkbox'){
            this.formValue[value] = this.formValue[value] ? false : true
        }

        if(typeof value === 'string' && value.includes('_ERROR_')){
            this.formInvalidFields[field] = value.replace('_ERROR_', '')
            return
        }

        if(type === 'upload'){
            if(typeof value === 'string'){
                return
            }
        }

		this.formValue[field] = value;
        this.handleAfterChange(field, value)
        this.isChanged = true
    }

    modifyValueForSubmit(data: StdObject){
		return data
	}

    customValidation(data: StdObject){}

    async handleSubmit(){
        this.closeAlert()
        let {data, invalid} = this.validation()
        data = this.modifyValueForSubmit(data)
        this.formInvalidFields = invalid
        
        if(await this.formIsInvalid(this.formInvalidFields)) return
        
        try {
		    this.customValidation(data) 
            if(this.errMessage.length) return
            this.isLoading = true
            let res = await this.handleRepositoryData(data) 

            if (res['status'] && res['status'] === 'error') {
				if(Array.isArray(res['message'])){
					res['message'].forEach((msg: string) => {
						this.errMessage.push(msg)
					})
				} else {
					this.errMessage.push(res['message']);
				}
                throw new Error('VALIDATION_FAILED')
			} else {
                this.handleAfterSubmit(res)
            }
        } catch (err: unknown) {
            this.errMessage = this.handleError(err, this.errMessage)
        } finally {
            this.isLoading = false
        }
    }

    async handleCreate(data: StdObject){
        return await this.repository.create(data)
    }

    async handleUpdate(data: StdObject){
        return await this.repository.update(this.paramId, data)
    }

    async handleRepositoryData(data: StdObject){
        if(this.paramId === 'add'){
            return await this.handleCreate(data)
        } else {
            return await this.handleUpdate(data)
        }
    }

    handleAfterSubmit(res: StdObject, message = 'New data has been created'){
        if(this.paramId === 'add'){
            setTimeout(() => {
                this.helper.showSuccessToast(message)
            }, 200)
            this.handleBack()
        } else {
            this.initialize()
        }
    }

    get getEditAccess(): boolean{
        return !this.isLoading && this.disabled ? true : false
    }

    get getSaveAccess(){
        return this.disabled ? false : true
    }

    handleCancel(){
        if(this.paramId === 'add'){
            this.router.navigate([this.afterCreateNavigate])
        } else {
            this.disabled = true
            if(this.isChanged){
                this.initialize()
            }
        }
    }

    handleTabChange(value: string){
        this.activeTab = value
    }

    handleEdit(){
        this.disabled = false
    }

    handleBack(){
        if(history.length > 2){
            history.back()
        } else {
            this.router.navigate([this.afterCreateNavigate])
        }
    }

    validation(forms: string [] = this.submittedForms){
        let data: StdObject = {}
        let needValidation: ValidateObject[] = []
        for (let form of forms){
			this.formConfig[form].forEach(item => {
				let value =  this.formValue[item.field];
                if(item.type === 'number'){
					value = this.helper.unformatNumber(value)
					value = parseFloat(value)
					if(isNaN(value)){
						value = undefined
					}
				} else if(item.type === 'upload'){
                    if(Array.isArray(value)){
                        value = value.map(item => item['filename'])
                    } else {
                        value = value ? value['filename'] : undefined
                    }
                } else if(item.type === 'date' || item.type === 'datetime' || item.type === 'time'){
                    if(typeof value === 'string' && item.type === 'time'){
                        value = this.helper.timeStringToDate(value)
                    }
                    value = value ? new Date(value) : undefined
                } else if(item.type === 'phone-code'){
                    data[item.config.field] = this.formValue[item.config.field]
                }
                
                data[item.field] = value;
				
				if (item.validation && !item.disabled){
					needValidation.push({
						'label': item.label,
                        'field': item.field,
						'validation': item.validation,
						'value': value
					});
				}

                if(item.type === 'phone-code' && item.config?.validation){
                    let ext = item.config as PhoneCodeConfig
                    needValidation.push({
                        'label': ext.label,
                        'field': ext.field,
                        'validation': ext.validation!,
                        'value': data[ext.field] 
                    })
                }
			});
		}

        const invalid = this.validator.validate(needValidation)
        return {data, invalid}
    }

    async formIsInvalid(formInvalidFields: StdObject, query: string = '.invalid-feedback'): Promise<boolean>{
        await new Promise(resolve => setTimeout(resolve, 0));
        const isErrorElExist = Boolean(document.querySelector(query))
		const invalid = isErrorElExist && Object.keys(formInvalidFields).length > 0
        
		if(invalid){
			this.scrollToInvalidField(query)
		}

		return invalid
	}

	scrollToInvalidField(query: string = '.invalid-feedback'){
		setTimeout(() => {
            let el = document.querySelector(query)
			el?.scrollIntoView({block: 'center'})
		}, 100)
	}

    handleSelectSearch(optionKey: string, value: string){
        if(timeout !== undefined){
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            this.handleSelectSearchData(optionKey, value)
        }, 300)
    }

    handleSelectSearchData(optionKey: string, value: string){}

    handleAfterChange(field: string, value: string){}

    closeAlert(){
        this.errMessage = []
    }

    handleError(err: Error | unknown, errMessage: string[] = []): string[]{
		setTimeout(() => {
            window.scrollTo({top: 0})
		}, 100)

		if(err instanceof Error){
			if(err.message !== 'VALIDATION_FAILED'){
				errMessage = [err.message]
			} 
		} else {
			errMessage = ['Server is unreachable.']
		}

		return errMessage
	}
}
