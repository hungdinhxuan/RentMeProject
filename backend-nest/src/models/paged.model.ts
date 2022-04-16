export class PagedModel<T>
{
    public maxPageSize: number = 50;
    private _pageSize: number;
    public pageSize: number;
    public getPageSize(): number {
        return this._pageSize;
    }
    public setPageSize(value: number): void {
        this._pageSize = (value > this.maxPageSize) ? this.maxPageSize : value;
    }
    public currentPage: number;
    public totalPages: number;
    public totalItems: number;
    public items: T[];
}