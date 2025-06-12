export interface UsercreateReturn{
   userid:string ,
   
}
export interface LogintockenRetuern{
   accessTocken:string,
   refreshTocken:string,
   user?:Partial<IUser>
}