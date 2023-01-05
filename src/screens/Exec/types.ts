export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  access: Number;
  preference: string;
  image: boolean;
  emailVerified: boolean;
}

export interface Tenure {
  id: string;
  semester: string;
  userId: string;
  year: Number;
  department: string;
  project: string;
  role: string;
  status: string;
  notes: string;
}

export interface DBUser extends UserData {
  tenures: Tenure[];
}

export interface User extends UserData {
  tenures: {
    [semesterYear: string]: Tenure;
  };
}

export interface TColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center" | "justify" | "inherit";
}

export interface TableProps {
  rows: User[];
  currentSemester: string;
}

export interface RowProps {
  row: User;
  onClick: Function;
}

export interface EditMemberModalProps {
  row: User;
  isVisible: boolean;
  closeModal: Function;
  currentSemester: string;
}
