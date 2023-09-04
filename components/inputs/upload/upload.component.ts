import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StdObject, UploadConfig } from '../../../interface';
import { Request } from '../../../services/request.service';
import { Toast } from '../../../services/toast.service';

@Component({
    selector: 'input-upload',
    templateUrl: './upload.component.html',
})
export class InputUploadComponent {
    constructor(
        private request: Request,
        private toast: Toast
    ){}
    
    @Output('nxChange') change = new EventEmitter 
    @Input('disabled') disabled: boolean = false
    @Input('value') value: StdObject[] | StdObject = {}
    @Input('config') config: UploadConfig = {}

    renderInput = true;

    id: string = `up${Math.floor(Math.random() * 100)}` 
    isLoading: boolean = false;

    handleDeleteFile(url: string | ArrayBuffer){
        let value;
        if(Array.isArray(this.value)){
            value = this.value.filter(item => item['url'] !== url)
        } else {
            value = {}
        }

        this.forceRerenderInput()

        this.change.emit(value)
    }

    forceRerenderInput(){
        this.renderInput = false
        setTimeout(() => {
            this.renderInput = true
        }, 100)
    }

    get getValue(): StdObject[]{
        if(Array.isArray(this.value)){
            return this.value
        } else {
            if(this.value?.['url']){
                return [this.value]
            } else {
                return []
            }
        }
    }

    isImage(name: string){
        let ext = ['.jpg', '.jpeg', '.heif', '.webm', '.png']
        let res = false 
        for(let e of ext){
            if(name.toLowerCase().includes(e)){
                res = true
                break
            }
        }
        
        return res
    }

    isValidUrl(value: string | ArrayBuffer | null){
        if(typeof value === 'string' && value.includes('http')){
            return true
        } else {
            return false
        }
    }

    async handleUpload(e: Event): Promise<void>{
        let value: StdObject | StdObject[] = this.getConfig['max']! > 1 ? [] : {}
        let file = (e.target as HTMLInputElement).files![0] 
        if(!file){
            return this.change.emit(value)
        }

        if(file.size / 1024000 > this.getConfig['maxSize']!){
            return this.change.emit(`_ERROR_File is bigger than ${this.getConfig['maxSize']} MB`)
        }

        if(this.config?.raw){
            return this.change.emit(file)
        }
        this.isLoading = true
        this.forceRerenderInput()

        try{
            
            const fd = new FormData();
            fd.append('files[]', file);
            const res = await this.request.upload(fd);
            if(res?.status === 'error'){
                throw new Error(res.message)
            }
            this.isLoading = false
            if(Array.isArray(value)){
                value = [...this.getValue, ...res]
            } else {
                value = res[0]
            }
        } catch(err){
            if(err instanceof Error){
                this.toast.show({
                    title: 'Error',
                    body: err.message
                })
            }
            this.isLoading = false
        }
        return this.change.emit(value) 
    }

    get getConfig(): UploadConfig{
        let conf = {
            max: 1,
            accept: 'image/*',
            maxSize: 5,
            ...this.config
        }
        return conf
    }

    get getFormat(){
        const accept = this.getConfig['accept']
        return accept?.replace('application/', '').replace('/*', '')
    }
}