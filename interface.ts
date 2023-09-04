export interface StdObject {
    [key: string]: any
}

export type TableHeaderType = 'text' | 'datetime' | 'date' | 'number' | 'img-preview' | 'image' | 'link' | 'custom'

export interface TableConfig {
    header: string,
    field: string,
    type?: TableHeaderType,
    width?: string | number,
    unsortable?: boolean, 
    valueCustomClass?: StdObject,
    className?: string,
    config?: any
}
export interface FormOptions{
    [key: string]: SelectOption[]
}

export interface TablePagination{
    maxPage: number,
    maxItem: number,
    total: number,
    current: number
}

export interface SelectOption {
    value: string | number | boolean,
    label: string,
    selectedLabel?: string,
    checked?: boolean
}


export type FilterType = 'search' | 'select' | 'date' | 'daterange' | 'numberrange' | 'month'
export interface FilterConfig {
    label: string,
    field: string,
    placeholder?: string,
    type: FilterType,
    optionKey?: string,
    config?: any,
    className?: string
}

export interface Breadcrumb {
    name: string, 
    url?: string,
    queryParams?: StdObject,
    active?: boolean
}

export interface InputConfig {
    label: string,
    field: string,
    placeholder?: string,
    type: InputType,
    name?: string,
    optionKey?: string,
    validation?: Array<ValidationType | ValidationConfig>,
    show?: any[],
    disabled?: boolean,
    config?: any,
    help?: string,
}

export interface FormConfig {
    [key: string]: InputConfig[]
}

export interface ModalConfig {
    show?: boolean,
    onCancel?: Function,
    onConfirm?: Function,
    cancelLabel?: string,
    confirmLabel?: string,
    title?: string,
    body?: string,
    useCancelButton?: boolean,
    useConfirmButton?: boolean,
    template?: any
}

export interface ToastConfig {
    show?: boolean,
    title?: string,
    body?: string,
    template?: any,
    timeout?: number
}

export interface SelectConfig {
    multiple?: boolean,
    allowSearch?: boolean,
    emitSearch?: boolean,
    useSelectAll?: boolean,
    selectedLabel?: string,
    useList?: boolean,
    useClear?: boolean
}

export interface UploadConfig{
    accept?: string,
    max?: number,
    maxSize?: number,
    className?: string,
    raw?: boolean
}

export interface DateConfig{
    max?: Date,
    min?: Date,
    format?: string
}

export type InputType = 'text' | 'email' | 'number' | 'password' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'texteditor' | 'upload' | 'select' | 'datetime' | 'time' | 'display' | 'phone-code' | 'tel' | 'separator' | 'month' | 'custom'

export type ValidationType = 'required' | 'email' | 'number' | 'maxInt' | 'table' | 'link' | 'max' | 'min' | 'equal' | 'unequal' | 'minLength' | 'maxLength'

export interface ValidationConfig {
    value?: string | number, 
    text?: string,
    type: ValidationType
}

export interface Tab {
    value: string, 
    name: string
}

export interface ValidateObject{
    value: any,
    field: string,
    label: string,
    validation: Array<ValidationType | ValidationConfig>,
}

export interface Sidebar {
    title: string,
    link?: string,
    icon?: string,
    acl: string | string[],
    key?: string | string[],
    children?: Sidebar[]
}

export interface ServerResponse{
    status: 'error' | 'success',
    message: string,
    data?: StdObject 
}

export interface PhoneCodeConfig {
    label: string,
    validation?: Array<ValidationType | ValidationConfig>,
    field: string
}

export type RequestMethod = 'get' | 'post' | 'patch' | 'put' | 'delete'
export interface ComponentInjectorConfig{
    key?: string,
    containerKey?: string
}

export interface NotificationLink {
    [key: string]: string | NotificationLinkConfig, 
}

export interface NotificationLinkConfig {
    path: string, 
    queryParams: StdObject
}