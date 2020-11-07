export interface IAd{
    image:string,
    title:string,
    descr:string,
    id:number,
    price:number,
    count:number,
    short_description:string,
    long_description:string,
    category:string,
    brand:string,
    status:"limited"|"unlimited"
}