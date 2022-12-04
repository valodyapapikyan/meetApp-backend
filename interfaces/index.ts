export  interface IProfile  {
  userName: string,
  email: string,
  firstName: string,
  lastName:string,
  linkedinId: string
}


export interface IRowModel <T> {
  rows: T[];
  count: number;
}
