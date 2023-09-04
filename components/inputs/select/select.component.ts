import { Component, HostListener, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SelectConfig, SelectOption, StdObject } from 'src/app/nxcore/interface';

@Component({
    selector: 'input-select',
    templateUrl: './select.component.html',
})

export class SelectComponent implements OnChanges{
    @Output('nxChange') change = new EventEmitter
    @Output('search') search = new EventEmitter
    @Input('disabled') disabled: boolean = false
    @Input('options') options: SelectOption[] = []
    @Input('placeholder') placeholder?: string = 'Select'
    @Input('config') config: SelectConfig = {};
    @Input('menuClassName') menuClassName: string = ''
    @Input('menuMinWidth') menuMinWidth: string = '150px'
    @Input('id') id?: string = `sl${Math.floor(Math.random() * 100)}`

    isFocus = false
    showMenu = false

    @Input('value') value: string | number | boolean | null | any[] = null
    @Input('customTrigger') customTrigger?: boolean = false;

    searchValue: string = '';

    menuPositionClassName = ''
    
    multiValue: any[] = []
    isOptionCheckClicked = false;
    scrollPosition = 0

    @HostListener('document:click', ['$event'])
    clickOutside($event: Event) {
        const el = $event.target as HTMLInputElement
        const isInisde = el.closest(`#${this.id}`)
        if(!isInisde){
            this.handleHideMenu()
        }
    }  

    modifiedOptions: SelectOption[] = []

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['options']){
            this.getOptions()
        } 
    }

    handleSelectCheckOption(option: SelectOption) {
        this.isOptionCheckClicked = true
        let value = []
        if(!Array.isArray(this.value)){
            this.value = []
        }

        if(Array.isArray(this.value) && this.value.includes(option.value)){
            value = this.value.filter(item => option.value !== item)
        } else {
            value = [...this.value as any[], option.value]
        }
        this.change.emit(value)
    }


    handleDeleteSelectedOption(opValue: string){
        let value = []
        if(Array.isArray(this.value)){
            value = this.value.filter(item => opValue !== item)
        }
        
        this.change.emit(value)
    }

    get getValueLabel(): string {
        if(this.isFocus){
            return this.searchValue
        }
        try {
            if(this.config?.multiple && Array.isArray(this.value)){
                const len = this.value.length
                if(len > 0){
                    return `${len} ${this.config.selectedLabel || 'Selected'}`
                } else {
                    return ''
                }
            } else {
                const option: SelectOption | undefined = this.options.find((op: SelectOption) => op.value === this.value) 
                return option!.selectedLabel || option!.label
            }
        } catch(err){
            return ''
        }
    }

    getListLabel(value: string | StdObject): string {
        let str = value
        try{
            if(typeof value === 'string'){
                str = JSON.parse(value)
            }
        } catch(err){
            throw new Error('WRONG_OPTION_FORMAT')
        }
       
        if(typeof str === 'string'){
            return str
        } else {
            return str['label']
        }
    }

    handleSelectOption(option: SelectOption) {
        this.change.emit(option.value)
        this.handleHideMenu()
    }

    handleSearch(e: Event) {
        const target = e.target as HTMLInputElement
        this.searchValue = target.value;
        if(this.config?.emitSearch){
            this.search.emit(target.value)
        } else {
            this.getOptions()
        }
    }

    handleBlur(){
        setTimeout(() => {
            if(!this.isOptionCheckClicked){
                this.handleHideMenu()
            }
        }, 200)
    }

    handleFocus(){
        this.isFocus = true;
        this.handleShowMenu()
    }

    getChecked(value: string | number | boolean): boolean {
        return (this.value as any[] || []).includes(value)
    }

    handleShowMenu(forceHide: boolean = false){
        if(this.showMenu && (!this.config?.multiple || forceHide)){
            this.handleHideMenu()
        } else {
            this.getOptions()
            this.detectScrollHeight()
            this.showMenu = true
            this.restoreScrollPosition()
        }
    }

    restoreScrollPosition(){
        setTimeout(() => {
            let dropdownEl = document.querySelector('.input-select .dropdown-menu')
            if(!dropdownEl) return
            dropdownEl.scrollTop = this.scrollPosition
        })
    }

    saveScrollPositon(){
        let dropdownEl = document.querySelector('.input-select .dropdown-menu')
        if(!dropdownEl) return 
        this.scrollPosition = dropdownEl.scrollTop
    }

    handleHideMenu(){
        if(this.showMenu){
            this.saveScrollPositon()
        }
        this.searchValue = ''
        if(this.config?.emitSearch){
            this.search.emit(this.searchValue)
        }
        this.showMenu = false
        this.isFocus = false
    }

    handleSelectAllCheckOption(){
        this.isOptionCheckClicked = true
        if(this.getSelectAllChecked){
            this.change.emit([])
        } else {
            const value = this.modifiedOptions.map((op) => op.value)
            this.change.emit(value)
        }
    }

    handleClearSelected(){
        this.change.emit(undefined)
    }

    get getSelectAllChecked(){
        if((this.value as any[] || []).length === this.options.length){
            return true
        } else {
            return false
        }
    }

    get valueIsNotEmptyArray(): boolean{
        if(Array.isArray(this.value) && this.value.length > 0){
            return true
        } else {
            return false
        }
    }

    getOptions(){
        if(!Array.isArray(this.options)){
            this.modifiedOptions = []
        } else if(this.searchValue && !this.config?.emitSearch){
            this.modifiedOptions = this.options.filter(op => op.label.toLowerCase().includes(this.searchValue.toLowerCase()))
        } else {
            this.modifiedOptions = this.options
        }
    }

    get isReadOnly(){
        if(this.config?.emitSearch === true){
            return false
        }
        if(this.config?.allowSearch === null || this.config?.allowSearch === undefined){
            if(this.options?.length < 10){
                return true
            } 
            return false
        }
        return !this.config?.allowSearch
    }

    detectScrollHeight(){
        if(this.menuClassName) return
        const el = document.querySelector(`#${this.id}`)
        let className = '' 
        if (el && window.innerHeight - el.getBoundingClientRect().bottom < 140){
            className = 'bottom-100'
        } 
        if(el && window.innerWidth - el.getBoundingClientRect().right < 150){
            className += ' end-0'
        }

        this.menuPositionClassName = className
    }
}