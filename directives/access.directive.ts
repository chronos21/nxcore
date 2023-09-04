import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[hasAccess]',
	standalone: true
})
export class Access {
	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
	) {}
	
	@Input()
	set hasAccess(val: string | any[]){
		const canAccess = checkAccess(val)

		if (canAccess) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}

export function checkAccess(val: string | any[]): boolean {
	const user = localStorage.getItem('user')
	let userAcl = []
	try {
		userAcl = (JSON.parse(user!)).acl || []
	} catch (err) {
		userAcl = []
	}

	let access = val;
	let param = false;

	if (Array.isArray(val)){
		access = val[0];
		if(val.length > 1){
			param = val[1];
		} else {
			param = true
		}
	} else {
		param = true;
	}

	if (access === 'BYPASS'){
		return true;
	}

	if ((userAcl.includes(access) || access === 'DEFAULT') && param) {
		return true;
	} else {
		return false;
	}
}