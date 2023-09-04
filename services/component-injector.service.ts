import { ApplicationRef, ComponentRef, Injector, createComponent, Injectable } from '@angular/core';
import { ComponentInjectorConfig } from '../interface';

@Injectable()
export class ComponentInjector {
    constructor(
        public applicationRef: ApplicationRef,
        public injector: Injector,
    ){}
    public ref!: ComponentRef<any>

    public create(component: any, config: ComponentInjectorConfig ){
        if(config.key){
            const existingEl = document.querySelector(config.key)
            if(existingEl) return
        } else {
            this.destroy()
        }

        const containerEl = document.querySelector(config.containerKey || 'body')
        if(!containerEl) return
        this.ref = createComponent(component, {
            environmentInjector: this.applicationRef.injector,
            elementInjector: this.injector
        })
		this.applicationRef.attachView(this.ref.hostView);
		containerEl.appendChild(this.ref.location.nativeElement);
        this.ref.changeDetectorRef.detectChanges()
    }

    public destroy(callback?: Function){
        if(!this.ref) return
        this.applicationRef.detachView(this.ref!.hostView)
        this.ref.destroy()
        if(callback){
            callback()
        }
    }
}
