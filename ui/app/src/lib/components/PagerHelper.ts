
interface IPageHelper {
  defaultPageSize: number
  onPageChange: (data: Array<any>, page: number, callback: (slice: Array<any>) => void) => void
  getPageSlice: (data: Array<any>, page: number, callback: (data: Array<any>, page: number) => void) => void
}

export const PagerHelper: IPageHelper = {
  defaultPageSize: 10,
  onPageChange: (data: Array<any>, page: number, callback: (slice: Array<any>) => void) => {
    const startIndex = (page - 1) * PagerHelper.defaultPageSize
    callback(data.slice(startIndex, page * PagerHelper.defaultPageSize))
  },
  getPageSlice: (data: Array<any>, page: number, callback: (data: Array<any>, page: number) => void) => {
    let newPage = page // This will be lowered when last item on a page is removed 
    if (data.length <= ((page - 1) * PagerHelper.defaultPageSize) && page > 1) {
      newPage--
    }
    const startIndex = ((newPage - 1) * PagerHelper.defaultPageSize)
    const slice = data.slice(startIndex, newPage * PagerHelper.defaultPageSize)
    callback(slice, newPage)
  }
}