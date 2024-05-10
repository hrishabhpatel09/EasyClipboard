export default class apiResponse{
    constructor(message:string, success:boolean, statusCode:number){
        this.message = message;
        this.success = success;
        this.statusCode = statusCode
    }
    message: string
    success: boolean
    statusCode: number
}