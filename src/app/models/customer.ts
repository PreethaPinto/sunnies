import { FormControl } from "@angular/forms";

export interface Customer
{
    firstName: string| null;
    lastName: string| null;
    email: string| null;
    password: string| null;
    phone: string| null;
    address: string| null;
    city: string| null;
    state: string| null;
    postCode: number | null;
}