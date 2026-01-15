import { UserRole } from "@/src/types";

export interface UserProps {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

export class User {
  public props: UserProps;

  constructor(props: UserProps) {
    this.props = { ...props };
  }

  id() {
    return this.props.id;
  }


}