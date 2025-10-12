export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}
export interface IModelPaginate<T> {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IAccount {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: {
      id: string;
      name: string;
      permissions: {
        id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }[];
    };
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IPermission {
  id?: string;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  id?: string;
  name: string;
  description: string;
  active: boolean;
  permissions: IPermission[] | string[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role?: {
    id: string;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProject {
  id?: string;
  name: string;
  description?: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICampaign {
  id?: string;
  title: string;
  description?: string;
  instructions?: string;
  rewardValue?: string;
  rewardType?: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  startDate?: string;
  endDate?: string;
  campaignType?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IUseCase {
  id?: string;
  usecaseName: string;
  description?: string;
  objective?: string;
  actor?: string;
  createdBy?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IScenario {
  id?: string;
  title: string;
  description?: string;
  precondition?: string;
  updatedBy?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITestcase {
  id?: string;
  title: string;
  description?: string;
  precondition?: string;
  dataTest?: string;
  steps?: string;
  expectedResult?: string;
  priority?: string;
  updatedBy?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISurvey {
  id?: string;
  surveyName: string;
  subTitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQuestion {
  id?: string;
  questionName?: string;
  questionType: string;
  isRequired: boolean;
  options?: string[];
  choices?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
} 


export interface IUserRecruitProfile {
  id?: number;
  recruitMethod: string;
  testerCount: number;
  devices: string;
  whitelist: string;
  gender: string;
  country: string;
  zipcode: string;
  householdIncome: string;
  isChildren: boolean;
  employment: string;
  gamingGenres: string;
  browsers: string;
  socialNetworks: string;
  webExpertise: string;
  languages: string;
  ownedDevices: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserProfile {
  age: number;
  zipcode: string;
  country: string;
  householdIncome: string;
  children: boolean;
  employment: string;
  education: string;
  gamingGenres: string;     
  browsers: string;       
  webExpertise: string;
  language: string;        
  computer: string;
  smartPhone: string;
  tablet: string;
  otherDevice: string;
  gender: "MALE" | "FEMALE" | "OTHER"; 
}

export interface ITesterCampaign {
  userId: string;
  campaignId: string;
  note: string;
}

export interface ITesterCampaignStatus {
  exists: boolean;
  status?: string;
  note?: string;
  // approved?: boolean;
}