


export interface FileUpload{
    name:string;
    data: any;
    encoding: string;
     tempFilePath: "";
     truncated: boolean;
     mimetype:string;
      

     mv: Function;
}