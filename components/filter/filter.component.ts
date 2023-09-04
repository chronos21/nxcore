import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterConfig, SelectConfig, SelectOption, StdObject } from 'src/app/nxcore/interface';
@Component({
    selector: 'nx-filter',
    templateUrl: './filter.component.html',
})

export class FilterComponent{
    @Input('handleChange') handleChange: Function = (field: string, event: any) => {}
    @Input('handleApply') handleApply: Function = () => {}
    @Input('handleReset') handleReset: Function = () => {}
    @Input('value') value: StdObject = {}
    @Input('options') options: StdObject = {}
    @Input('config') config: FilterConfig[] = [] 
    @Input('useMoreFilterButton') useMoreFilterButton: boolean = true 
    @Input('columnConfigOptions') columnConfigOptions: SelectOption[] = []  
    @Input('columnConfigValue') columnConfigValue: string[] = []
    @Output('columnConfigChange') columnConfigChange = new EventEmitter

    showMore = window.screen.width < 992 ? false : true

    columnSelectConfig: SelectConfig = {
        multiple: true, 
        allowSearch: false,
        useSelectAll: true
    }

    get getLimit(){
        if(window.screen.width < 992){
            return 1
        }

        if(window.screen.width >= 1400){
            return 4
        }
        return 3
    }

    handleColumnConfig(value: string[]){
        this.columnConfigChange.emit(value)
    }

    get getColumnConfigValue(): string[]{
        if(this.columnConfigValue.length === 0){
            return this.columnConfigOptions.map(item => item.value as string)
        } else {
            return this.columnConfigValue
        }
    }

    getSelectConfig(config: SelectConfig){
        let newConfig = {...config}
        if(newConfig['useClear'] !== false){
            newConfig['useClear'] = true
        }
        return newConfig
    }
}

