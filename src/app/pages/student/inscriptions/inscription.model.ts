import { User } from '../users/user.model';
export class Course{
  constructor(
    public name: string,
    public period: number,
    public capacity: number,
    public active: boolean,
    public id?: string
  ) {}
}
