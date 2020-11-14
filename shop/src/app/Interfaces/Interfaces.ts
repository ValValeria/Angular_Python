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
    status:"limited"|"unlimited",
    characterictics:string
}

export interface ProductsInfo{
    data:{
        categories:string[],
        price:[{min_price:number},{max_price:number}]
    }
}

export interface IUser{
    username:string
    email:string
    password:string
}

export interface IComment{
   id:number,
   message:string,
   rating:number,
   sender:{username:string}
}

export interface ProductsBrand{
    data:{
        brands:string[]
    }
}