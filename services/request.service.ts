import { Injectable } from "@angular/core"
import { environment } from "src/environments/environment"
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RequestMethod, StdObject } from "../interface";
import { Router } from "@angular/router";
import { Modal } from "./modal.service";

@Injectable()
export class Request {
    path: string = '/request/request'
    server = environment.server 
    retry = 0
    exportFileType = 'CSV'

    constructor(
        public http: HttpClient,
        private router: Router,
        private modal: Modal
    ) { }

    public async post(url: string, data: object){
        return await this.handler('post', url, data)
    }

    public async get(url: string){
        return await this.handler('get', url)
    }

    public async delete(url: string, data: object){
        return await this.handler('delete', url, data)
    }

    public async put(url: string, data: object){
        return await this.handler('put', url, data)
    }

    public async patch(url: string, data: object){
        return await this.handler('patch', url, data)
    }

    public async handler(method: RequestMethod, url: string, data?: object) {
        const fullUrl = `${this.server}${url}`
        try {
            let req;
            if (method === 'get' || method === 'delete') {
                req = this.http[method](fullUrl, {
                    headers: this.getHeader()
                })
            } else {
                req = this.http[method](fullUrl, data, {
                    headers: this.getHeader()
                })
            }
            const res: any = await firstValueFrom(req)
            if(res['status'] === 'success'){
                return res.data || res.message || res;
            } else if(res['status'] === 'error' && res['code'] === '008'){
				return this.getRefreshToken(method, url, data)
			} else {
                return res.data ? res.data : res 
            }
        } catch (err: unknown) {
            if(err instanceof HttpErrorResponse){
                if(err.status === 401 && !url.includes('login')){
                    if(err.error?.code === '039'){
                        return this.handleSuspended()
                    }
                    return this.getRefreshToken(method, url, data)
                } else if(err.status === 403){
                    this.router.navigate(['/'])
                    return {
                        status: 'error',
                        message: err.error?.message || 'Access forbidden.'
                    }
                }

                return {
                    status: 'error',
                    message: err.error?.message || 'Server unreachable. Please try again later.'
                }
            } else {
                return {
                    status: 'error',
                    message: 'Unknown error.'
                }
            }
            
        }
    }

    protected getHeader() : HttpHeaders {
        let header = new HttpHeaders();
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            header = header.append('access-token', accessToken);
        }
        return header;
    }

    protected forceLogout(){
        localStorage.clear()
        sessionStorage.clear()
        this.router.navigate(['/login'])
        this.modal.show({
            title: 'Unauhtorized',
            body: 'Session expired. You need to login again.',
            useConfirmButton: false,
            cancelLabel: 'Close'
        })
    }

    public async getRefreshToken(method: RequestMethod, url: string, data: any): Promise<any>{
        let headers = new HttpHeaders();
		headers = headers.append('Content-Type', 'application/json');
		headers = headers.append('refresh-token', localStorage.getItem('refreshToken')!)
		let refreshUrl = (environment.authServer || environment.server) + '/token' 
		try {
			let res: any = await firstValueFrom(this.http.post( refreshUrl, {}, { headers })) 
			if(res['status'] === 'success') {
				const accessToken = res['data']['accessToken']
				localStorage.setItem('accessToken', accessToken)
                this.retry += 1
                if(this.retry > 3){
                    this.retry = 0
                    return;
                }
				return this.handler(method, url, data)
			} else if(res['status'] === 'error'){
                return this.forceLogout()
			} 
		} catch (err) {
            console.log(err)
			return this.forceLogout()
		}
		
	}

    public handleSuspended(){
        try{
            let user: StdObject = JSON.parse(localStorage.getItem('user')!)
            if(!user['id']) throw new Error('USER_DATA_CORRUPTED')

            if (user['status'] !== 'SUSPENDED') {
                user['status'] = 'SUSPENDED'
                localStorage.setItem('user', JSON.stringify(user))
                setTimeout(() => location.reload(), 300)
            }
        } catch(err: unknown){
            return this.forceLogout()
        }

		return {
			status: 'error',
			message: 'Your account has been suspended. Please contact our support team.'
		}
	}

    async list(bodyParams: StdObject, doExport = false, ...args: Array<any>): Promise<any> {
		const exportParam = doExport ? `?export=${this.exportFileType}` : '';
		return await this.post(this.path + '/list' + exportParam, bodyParams);
    }

	async detail(id: number | string, ...args: Array<any>): Promise<any> {
		return await this.get(this.path + '/detail/' + id);
	}

	async create(bodyParams: StdObject, ...args: Array<any>): Promise<any> {
		return await this.put(this.path + '/create', bodyParams);
	}

	async update(id: number | string, bodyParams: StdObject, ...args: Array<any>): Promise<any> {
		return await this.patch(this.path + '/update/' + id, bodyParams);
	}

    async updateStatus(bodyParams: StdObject, ...args: Array<any>): Promise<any> {
		return await this.patch(this.path + '/update-status', bodyParams);
	}

    async upload(bodyParams: FormData) {
		return await this.patch('/public/file/upload', bodyParams)
	}

    async import(bodyParams: FormData, ...args: Array<any>) {
        return await this.put(this.path + '/import', bodyParams)
	}
}

