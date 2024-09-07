export type StrObj = Record<string, unknown>;
export type Arrayable<T> = T | T[];
export type Nullable<T> = T | null;

export interface ClCommon {
    ensureArray: <T>(val: Arrayable<T>) => T[];
    disableEl: (...el: HTMLElement[]) => void;
    enableEl: (...el: HTMLElement[]) => void;
    disableBtn: (...btns: HTMLButtonElement[]) => void;
    enableBtn: (...btns: HTMLButtonElement[]) => void;
    hideEl: (...el: HTMLElement[]) => void;
    showEl: (...el: HTMLElement[]) => void;
    showElIf: (condition: boolean, ...el: HTMLElement[]) => void;
    enableElIf: (condition: boolean, ...btns: HTMLButtonElement[]) => void;
    tempDisable: (...btns: HTMLButtonElement[]) => Record<"revert", () => void>;
    getNameFromId: (id: number, obj: StrObj[]) => string;
    switchVisible: (
        visible: HTMLElement | HTMLElement[],
        hidden: HTMLElement | HTMLElement[]
    ) => void;
    strToIntId: (str: string) => Nullable<number>;
    strToUser: (str: string) => Nullable<{ id: number; name: string }>;
    durationInMins: (started: string, ended: string) => string;
}

export interface ClEl {
    withListener: <T extends HTMLElement>(
        el: T,
        onClick?: Nullable<EventListener>,
        event?: string
    ) => T;
    append: <T extends HTMLElement>(parent: T, ...children: HTMLElement[]) => T;
    any: (
        tag: string,
        props?: StrObj,
        classes?: Arrayable<string>
    ) => HTMLElement;
    div: (props?: StrObj, classes?: Arrayable<string>) => HTMLDivElement;
    hr: (props?: StrObj, classes?: Arrayable<string>) => HTMLHRElement;
    button: (
        props?: StrObj,
        classes?: Arrayable<string>,
        onClick?: Nullable<EventListener>,
        as?: string
    ) => HTMLButtonElement;
    input: (
        props?: StrObj,
        classes?: Arrayable<string>,
        onChange?: Nullable<EventListener>
    ) => HTMLInputElement;
    select: (
        onChange: EventListener,
        options: HTMLOptionElement[],
        props?: StrObj,
        classes?: Arrayable<string>
    ) => HTMLSelectElement;
    option: (
        value: unknown,
        displayName: string,
        props?: StrObj,
        classes?: Arrayable<string>
    ) => HTMLOptionElement;
}

export type HttpError = {
    message: string;
    error?: Arrayable<string>;
};
export interface HttpResponse {
    response: Response;
    err: Nullable<HttpError>;
}
export interface HttpDataResponse extends HttpResponse {
    data: Nullable<StrObj>;
}

export interface ClHttp {
    unknownError: Error;
    setError: (message: string, error?: Arrayable<string>) => void;
    setErrorTimeout: (
        el: HTMLElement,
        err: HttpError,
        timeout?: number
    ) => void;
    setErrorEx: (
        el: HTMLElement,
        message: string,
        error?: Arrayable<string>
    ) => void;
    clearError: () => void;
    clearErrorEx: (el: HTMLElement) => void;
    sendRequest: (
        path: string,
        method: string,
        headers?: Nullable<RequestInit["headers"]>,
        body?: Nullable<RequestInit["body"]>,
        errorTimeout?: number,
        errDiv?: HTMLElement
    ) => Promise<HttpResponse>;
    getJson: (
        path: string,
        errorTimeout?: number,
        errDiv?: HTMLElement
    ) => Promise<HttpDataResponse>;
    delete: (
        path: string,
        errorTimeout?: number,
        errDiv?: HTMLElement
    ) => Promise<HttpDataResponse>;
    postJson: (
        path: string,
        body: any,
        errorTimeout?: number,
        errDiv?: HTMLElement
    ) => Promise<HttpDataResponse>;
}

export interface ModalConfig {
    wrapperId?: string;
    backdropId?: string;
    withKeyListener?: boolean;
}

export interface ModalQueueItem {
    contents: string | HTMLElement;
    confirmName?: string;
    cancelName?: string;
    noConfirm?: boolean;
    cleanup?: () => void;
    onConfirm?: () => Promise<boolean>;
    onCancel?: () => void;
}

export interface ModalApi {
    visible: () => boolean;
    addItem: (item: ModalQueueItem) => void;
}

export interface ClModal {
    initialize: (config: ModalConfig) => ModalApi;
}

export interface TableRow {
    el: HTMLTableRowElement;
    col: (name: string) => Nullable<HTMLTableCellElement>;
    val: (name: string) => string;
    data: (name: string, item: string) => string;
    state: () => StrObj;
    setActive: () => void;
    setInactive: () => void;
}

export interface TableState {
    search: URLSearchParams;
    data: Record<number, StrObj[]>;
}

export interface TableApi {
    state: TableState;
    table: {
        root: HTMLTableElement;
        body: HTMLTableSectionElement;
        cols: string[];
        rows: () => TableRow[];
        selected: () => Nullable<TableRow>;
        active: () => Nullable<TableRow>;
        highlight: (row: TableRow) => void;
        removeHighlight: () => void;
        rowId: (id: number | string) => string;
        cellId: (id: number | string, name: string) => string;
    };
    page: {
        current: () => number;
        max: () => boolean;
        min: () => boolean;
        inc: () => boolean;
        dec: () => boolean;
    };
    prevBtn: HTMLButtonElement;
    nextBtn: HTMLButtonElement;
    getLimit: () => number;
    getOffset: () => number;
    hasData: () => boolean;
    renderCurrentPage: () => void;
}

export interface TableConfig {
    id?: string;
    prevId?: string;
    nextId?: string;
    sizeId?: string;
    currentPageId?: string;
    maxPageId?: string;
    defaultLimit?: number;
    defaultOffset?: number;
    transform?: (
        api: TableApi,
        col: string,
        val: unknown,
        row: TableRow,
        data: StrObj
    ) => string | HTMLElement;
    onRender?: (api: TableApi, entry: StrObj, row: TableRow) => void;
    afterRender?: (api: TableApi, data: StrObj[]) => void;
    onInitialize?: (api: TableApi, row: TableRow) => StrObj;
    onClick?: (row: TableRow) => void;
    onFetch?: (search: string) => Promise<StrObj[]>;
}

export interface ClTable {
    initialize: (config: TableConfig) => TableApi;
}

declare global {
    interface Window {
        clCommon: ClCommon;
        clEl: ClEl;
        clHttp: ClHttp;
        clModal: ClModal;
        clTable: ClTable;
    }
}
