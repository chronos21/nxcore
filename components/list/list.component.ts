import { Component, Input, ContentChild, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Breadcrumb, FilterConfig, FormOptions, SelectOption, StdObject, Tab, TableConfig } from "src/app/nxcore/interface";
import { Helper } from '../../services/helper.service';
@Component({
    selector: 'nx-list',
    templateUrl: './list.component.html',
})

export class ListComponent {
	@Input('props') props!: BaseList
    @ContentChild('action') action?: TemplateRef<any>;
    @ContentChild('cell') cell?: TemplateRef<any>;
}

export class BaseList{
    data: StdObject[] = []

    pageCurrent: number = 1;
	pageTotal: number = 0;
	pageList: number[] = [];
	dataPerPage: number = 20;
	dataTotal: number = 0;
    sortValue: StdObject = {}

    isLoading: boolean = false

    tableConfig: TableConfig[] = []

    detailUrl:string = window.location.pathname
    createUrl:string = window.location.pathname + '/add'

    filterOptions: FormOptions = {}
    filterConfig: FilterConfig[] = []
    filterValue: StdObject = {}

    title: string = ''
    breadcrumb: Breadcrumb[] =  []

    useMoreFilterButton = true;
    useAddButton = true
    useExportButton = false
    useImportButton = false
    useQueryFilter = false;
    useActionColumn = true;
    useFilter = true;
    usePagination = true;
    useTable = true;
    
    useCustomStatusStyle = true
    statusStyleClassConfig: StdObject = {}
    customStatusStyleFields: string[] = ['status']

    errMessage: string[] = []
    limitDataLength: boolean = true
    alertClassName = 'bg-danger text-white'

    tabs: Tab[] = [];
    activeTab: string =  '';

    importAccept = '.csv'
    importTemplate = '/assets/files/template_import_transaction.csv'

    filterItemIndex?: StdObject;
    watchingQueryParams = false
    isInit = false

    columnConfigValue: string[] = []
    columnConfigOptions: SelectOption[] = []

    constructor(
        public repository: any,
        public router?: Router,
        public helper?: Helper,
        public route?: ActivatedRoute,
    ){}
    
    initialize(callback?: Function){
        if(this.useQueryFilter && !this.watchingQueryParams){
            this.watchingQueryParams = true
            this.watchQueryParams(callback)
            return
        }
        this.isLoading = true
        this.getData()
            .then(() => {
                if(callback){
                    callback()
                }
            })
            .catch(err => {
                this.helper?.toast.show({
                    title: 'Error',
                    body: err.message
                })
            })
            .finally(() => {
                this.isInit = true
                this.isLoading = false
                this.updateColumnConfigOptions()
                this.getSavedColumnConfigValue()
            })
        
    }
    
    initFilterValue(){
        let value = { ...this.route?.snapshot.queryParams }
        this.pageCurrent = 1
        
        Object.keys(value).forEach(key => {
            if(key === 'page'){
                try{
                    this.pageCurrent = Number(value[key])
                } catch(err){
                    console.log(err)
                }

                delete value[key]
            } else if(key === 'sort'){
                let arr = value[key].split(':')
                let field = arr[0]
                let val = arr[1]
                this.sortValue = { [field]: val }
                delete value[key]
            } else {
                let filter = this.getFilterItem(key)
                if(filter){
                    if(filter.type === 'select' && filter.config?.multiple){
                        if(!Array.isArray(value[key])){
                            value[key] = [value[key]]
                        }
                        if(!isNaN(value[key][0])){
                            value[key]  = value[key].map((str: string) => Number(str) )
                        }
                    } else if(filter.type === 'daterange'){
                        let fieldArr = filter.field.split('|')
                        let start = fieldArr[0]
                        let end = fieldArr[1]
                        if(!value[filter.field]){
                            value[filter.field] = {
                                start: value[start],
                                end: value[end]
                            }
                            delete value[start]
                            delete value[end]
                        }
                    } else if(filter.type === 'numberrange'){
                        let fieldArr = filter.field.split('|')
                        let from = fieldArr[0]
                        let to = fieldArr[1]
                        if(!value[filter.field]){
                            value[filter.field] = {
                                from: value[from],
                                to: value[to]
                            }
                            delete value[from]
                            delete value[to]
                        }
                    }
                }
            }


        })

        this.filterValue = value
    }
    
    async getData(doExport = false){
        const bodyParams: StdObject = {
			pageCurrent : this.pageCurrent,
			dataPerPage : this.dataPerPage,
			filter :  this.sanitizeFilterValue(this.filterValue),
			order: this.sortValue,
		};

		bodyParams['filter'] = this.modifyFilter(bodyParams['filter'])
        if(doExport){
			this.isLoading = true
            bodyParams['option'] = {
				tz: this.helper!.getTimezoneOffset()
			}
		} 
        let data = await this.handleRepositoryData(bodyParams, doExport)
        if(doExport){
            this.isLoading = false
            return data
        }

        if(data && data['status'] === 'error'){
            throw new Error(data['message'])
        }
        let useCustomStatusStyle = this.useCustomStatusStyle && this.customStatusStyleFields.length && Object.keys(this.statusStyleClassConfig).length
        
        if(data){
            this.data = (data.list || []).map((item: StdObject, idx: number) => {
                item['link'] = `${this.detailUrl}/${item['id']}`
                if(useCustomStatusStyle){
                    this.customStatusStyleFields.forEach(field => {
                        if(item[field]){
                            item[`_CLASS_${field}`] = this.statusStyleClassConfig[item[field]?.toUpperCase()]
                        }
                    })
                }
                item = this.modifyValue(item, idx)
                return item
            })
            this.pageTotal = data.pageTotal;
            this.dataTotal = data.countTotal;
        }

    } 

    async handleRepositoryData(bodyParams: StdObject, doExport: boolean){
        return await this.repository.list(bodyParams, doExport)
    }

    modifyFilter(filter: StdObject){
		return filter
	}

    sanitizeFilterValue(filterValue: StdObject){
        let value = {...filterValue}
        Object.keys(value).forEach(key => {
            let filter = this.getFilterItem(key) 
            if(filter){
                if(filter.type === 'daterange'){
                    let keyArr = key.split('|')
                    if(keyArr.length === 1){
                        throw new Error('WRONG_DATERANGE_FIELD')
                    }
                    let start = keyArr[0]
                    let end = keyArr[1]
    
                    value[start] = this.helper?.formatDateFilter(value[key]['start']) 
                    value[end] = this.helper?.formatDateFilter(value[key]['end'], true)
                    delete value[key] 
                } else if(filter.type === 'numberrange'){
                    let keyArr = key.split('|')
                    let start = keyArr[0]
                    let end = keyArr.length > 1 ? keyArr[1] : ''
    
                    value[start] = value[key]['from']
                    value[end] = value[key]['to']
                    delete value[key] 
                }
                if(Array.isArray(value[key]) && value[key].length === 0){
                    delete value[key]
                }
            }
            
        })

        return value
    }

    
	modifyValue(item: StdObject, idx: number = 0): StdObject{
		return item
	}

	async handleExport(){
		try{
			const res = await this.getData(true)
            if(res['url']){
                window.open(res['url'])
            } else {
                throw new Error(res['message'])
            }
		} catch(err: unknown){
            if(err instanceof Error){
                this.helper?.showErrorToast(err.message)
            } else {
                console.log(err)
            }
		}
	}

    handleSort(field: string){
        let value = 'ASC'
        if(this.sortValue[field] === value){
            value = 'DESC'
        } 

        this.sortValue = {
            [field]: value
        }

        if(this.useQueryFilter){
            this.router?.navigate([window.location.pathname], {
                queryParams: {
                    ['sort']: `${field}:${value}`
                },
                queryParamsHandling: 'merge'
            })
        }

        this.initialize()
    }

    handleFilterChange(field: string, e: any){
        let value = e; 
        if(e?.target){
            value = e.target.value
        } 
        this.filterValue[field] = value
    }

    handleFilterReset(reinit: boolean = true){
        if(this.useQueryFilter){
            this.router?.navigate([window.location.pathname])    
        }
        this.filterValue = {}
        this.sortValue = {}
        this.pageCurrent = 1
        if(reinit){
            this.initialize()
        }
    }

    handleFilterApply(){
        if(this.useQueryFilter){
            this.pageCurrent = 1
            let value = {...this.filterValue}
            let deleteKey = false
            Object.keys(value).forEach(key => {
                deleteKey = false
                let filter = this.getFilterItem(key)
                if(filter){
                    if(filter.type === 'daterange'){
                        if(value[key]['start'] || value[key]['end']){
                            let keyArr = key.split('|')
                            let start = keyArr[0]
                            let end = keyArr[1]
                            value[start] = this.helper?.formatDate(value[key]['start'], 'yyyy-MM-dd')
                            value[end] = this.helper?.formatDate(value[key]['end'], 'yyyy-MM-dd')
                        }
                        deleteKey = true
                    }
        
                    if(filter.type === 'numberrange'){
                        if(value[key]['from'] || value[key]['to']){
                            let keyArr = key.split('|')
                            let from = keyArr[0]
                            let to = keyArr[1]
                            value[from] = value[key]['from']
                            value[to] = value[key]['to']
                        }
                        deleteKey = true
                    }
                }
    
                if(!value[key]){
                    deleteKey = true
                }
    
                if(deleteKey){
                    delete value[key]
                }
            })
            this.router?.navigate([window.location.pathname], {
                queryParams: value,
            })
        }
        this.initialize()
    }

    handlePageChange(value: number){
        if(this.useQueryFilter){
            this.router?.navigate([window.location.pathname], {
                queryParams: {
                    page: value
                },
                queryParamsHandling: 'merge'
            })
        } else {
            setTimeout(() => {
                let tableEl = document.querySelector('.filter-wrapper .btn-dark')
                if(tableEl){
                    tableEl.scrollIntoView({block: 'start'})
                } else {
                    this.helper?.scrollToTop()
                }
            }, 300)
        }
        this.pageCurrent = value
        this.initialize()
        
    }

    handleTabChange(value: string){
        this.activeTab = value
        this.handleFilterReset(false)
        this.getSavedColumnConfigValue()
    }

    async handleImport(value: any){
        try {
			const fd = new FormData();
			fd.append('file', value);
			let res = await this.repository.import(fd)
            if(res && res['status'] !== 'error'){
                this.initialize()
            }
            this.handleAfterImport(res)
		} catch (err) {
            console.log(err)
		}
    }

    handleAfterImport(res: StdObject){
        return
    }

    closeAlert(){
        this.errMessage = []
    }

    watchQueryParams(callback?: Function){
        if(this.useQueryFilter){
            this.route?.queryParams.subscribe(() => {
                if(this.isLoading) return
                this.initFilterValue()
                this.initialize(callback)
            })
        }
    }

    updateFilterItemIndex(){
        let obj: StdObject = {}
        this.filterConfig.forEach((item, idx) => {
            if(item.field.includes('|')){
                let fieldArr = item.field.split('|')
                obj[fieldArr[0]] = idx
                obj[fieldArr[1]] = idx
            }
            obj[item.field] = idx
        })
        this.filterItemIndex = obj
    }

    getFilterItem(key: string): FilterConfig | null {
        if(!this.filterItemIndex){
            this.updateFilterItemIndex()
        }

        try{
            let idx = this.filterItemIndex![key]
            return this.filterConfig[idx] 
        } catch(err){
            return null
        }
    }

    handleColumnChange(value: string[]){
        if(this.columnConfigValue.length === 1 && value.length === 0){
            return
        }
        this.columnConfigValue = value
        sessionStorage.setItem(`${location.pathname}+891column${this.activeTab}`, JSON.stringify(this.columnConfigValue))
    }

    getSavedColumnConfigValue(){
        try{
            this.columnConfigValue = JSON.parse(sessionStorage.getItem(`${location.pathname}+891column${this.activeTab}`)!) || []
        } catch(err){
            this.columnConfigValue = []
        }
        this.handleColumnChange(this.columnConfigValue)
    }

    
    updateColumnConfigOptions(){
        this.columnConfigOptions = this.tableConfig.map(item => ({value: item.field, label: item.header}))
    }

    get getTableConfig(): TableConfig[]{
        if(this.columnConfigValue.length > 0){
            return this.tableConfig.filter(item => this.columnConfigValue.includes(item.field))
        }
        return this.tableConfig
    }

}  
