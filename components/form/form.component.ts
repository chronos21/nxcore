import { Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { FormConfig, FormOptions, StdObject } from 'src/app/nxcore/interface';

@Component({
    selector: 'nx-form',
    templateUrl: './form.component.html',
})

export class FormComponent implements OnChanges {
    @Input('formLayout') formLayout?: StdObject
	@Input('disabled') disabled: boolean = false
    @Input('formValue') formValue: StdObject ={}
    @Input('formConfig') formConfig: FormConfig = {}
    @Input('formInvalidFields') formInvalidFields: StdObject = {}
    @Input('activeTab') activeTab: string = ''
    @Input('activeForm') activeForm: string = ''
    @Input('formOptions') formOptions: FormOptions = {}
    @Input('handleChange') handleChange: Function = () => {}
	@Input('labelClassName') labelClassName: string = 'col-lg-3 col-form-label'
	@Input('className') className: string = ''
	@Input('handleSelectSearch') handleSelectSearch = (optionKey: string, value: string) => {}
	@Input('handleSubmit') handleSubmit: Function = () => {}
	@ContentChild('customField') customField?: TemplateRef<any>;

	layoutKeys: string[] = []

    handleShowField(show: any[] | undefined){
		if (!show) return true;
		let field = show[0] || '';
		let param = show[1];
		let type = show[2] || '_EQUAL_';
		let val = this.formValue[field] ?? '';

		if(field instanceof Function){
			return field()
		}

		if(param === '_EXIST_'){
			if(val === 0) return true
			return Boolean(val)
		}
		if(field === '_PREVIEW_'){
			return this.disabled 
		}
		if(field === '_EDIT_'){
			return !this.disabled 
		}
		if (type === 'UNEQUAL'){
			if(val !== param){
				return true;
			}
		} else if (type === '_INCLUDES_'){
			if (param.includes(val)){
				return true;
			}
		} else {
			if (val === param){
				return true;
			}
		}

		return false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['formConfig'] || changes['formLayout'] || changes['activeTab']){
			this.layoutKeys = this.getLayoutKeys()
		}
	}

	getLayoutKeys(){
		const formFieldsKeys: string[] = Object.keys(this.formConfig)
		try {
			if(this.formLayout && this.activeTab && this.formConfig[this.activeTab]){
				return this.formLayout[this.activeTab]
			} else {
				if(formFieldsKeys.length){
					if(this.activeForm){
						let key = formFieldsKeys.find(item => item === this.activeForm)
						if(key){
							return [key]
						} else {
							return formFieldsKeys
						}
					}
					return formFieldsKeys
				} else {
					throw new Error('Check your formConfig value')
				}
			}
		} catch (err) {
			return []
		}
		
	}
}
