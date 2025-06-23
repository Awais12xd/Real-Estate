class apiResponse{
    constructor(statusCode,data,message="Success",more){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode<400;
        this.more=more;
    }
}

export {apiResponse};