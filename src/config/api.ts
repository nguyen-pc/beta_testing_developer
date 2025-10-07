import {
  type IBackendRes,
  type IAccount,
  type IUser,
  type IPermission,
  type IRole,
  type IModelPaginate,
  type IProject,
  type IUseCase,
  type IScenario,
  type ITestcase,
} from "./../types/backend.d";

import axios from "../config/axios-customize";

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string) => {
  console.log("callRegister", {
    name,
    email,
    password,
  });
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
  });
};

export const callRegisterRecruiter = (
  name: string,
  email: string,
  password: string,
  phoneNumber?: string,
  taxNumber?: string,
  companyName?: string
) => {
  console.log("callRegister", {
    name,
    email,
    password,
    phoneNumber,
    taxNumber,
    companyName,
  });
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
    phoneNumber,
    taxNumber,
    companyName,
  });
};

export const callLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
    username,
    password,
  });
};
export const callLoginGoogle = (token: string) => {
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login-google", {
    token,
  });
};

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh");
};

export const callLogout = () => {
  return axios.post<IBackendRes<string>>("/api/v1/auth/logout");
};

export const callForgotPassword = (email: string) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/auth/forgot_password?email=${encodeURIComponent(email)}`
  );
};

export const callResetPassword = (token: string, newPassword: string) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/auth/reset_password?token=${token}`,
    { newPassword }
  );
};

// Module Project
export const callCreateProject = (data: IProject) => {
  return axios.post<IBackendRes<IProject>>("/api/v1/projects/create", data);
};

export const callUpdateProject = (id: number, data: IProject) => {
  console.log("callUpdateProject", { id, data });
  return axios.put<IBackendRes<IProject>>(
    `/api/v1/projects/update/${id}`,
    data
  );
};

export const callGetProject = (id: number) => {
  return axios.get<IBackendRes<IProject>>(`/api/v1/projects/${id}`);
};
export const callFetchProjectByCompany = (id: string, query: string) => {
  console.log("callFetchProjectByCompany", { id, query });
  return axios.get<IBackendRes<IModelPaginate<IProject>>>(
    `/api/v1/projects/all/${id}?${query}`
  );
};

export const callDeleteProject = (id: string) => {
  console.log("callDeleteProject", { id });
  return axios.delete<IBackendRes<null>>(`/api/v1/projects/${id}`);
};

//Module Campaign

export const callFetchCampaignByProject = (id: string, query: string) => {
  console.log("callFetchCampaignByProject", { id, query });
  return axios.get<IBackendRes<IModelPaginate<ICampaign>>>(
    `/api/v1/project/${id}/campaigns?${query}`
  );
};

export const callGetCampaign = (id: number) => {
  return axios.get<IBackendRes<ICampaign>>(`/api/v1/campaigns/${id}`);
}
export const callCreateCampaign = (data: ICampaign) => {
  return axios.post<IBackendRes<ICampaign>>("/api/v1/campaigns/create", data);
}

// Module Campaign
export const callGetUseCasesByCampaign = (campaignId: string, query: string) => {
   return axios.get<IBackendRes<IModelPaginate<IUseCase>>>(
    `/api/v1/usecase/campaign/${campaignId}?${query}`
  );
}

export const callCreateUseCase = (data: Partial<IUseCase>) => {
  return axios.post<IBackendRes<IUseCase>>("/api/v1/usecase/create", data);
}

export const callUpdateUseCase = (id: number, data: Partial<IUseCase>) => {
  return axios.put<IBackendRes<IUseCase>>(`/api/v1/usecase/update/${id}`, data);
}

export const callDeleteUseCase = (id: number) => {
  return axios.delete<IBackendRes<null>>(`/api/v1/usecase/delete/${id}`);
}

// Module Scenario
export const callGetScenariosByUseCase = (useCaseId: number, query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IScenario>>>(
    `/api/v1/usecase/${useCaseId}/test_scenario?${query}`
  );
};

export const callCreateScenario = (data: IScenario) => {
  console.log("callCreateScenario", data);
  return axios.post<IBackendRes<IScenario>>("/api/v1/usecase/test_scenario/create", data);
};

export const callUpdateScenario = (id: number, data: Partial<IScenario>) => {
  console.log(data, id)
  return axios.put<IBackendRes<IScenario>>(`/api/v1/usecase/test_scenario/update/${id}`, data);
};

export const callDeleteScenario = (id: number) => {
  return axios.delete<IBackendRes<null>>(`/api/v1/usecase/test_scenario/delete/${id}`);
}

// Module Testcase
export const callGetTestcasesByScenario = (scenarioId: string, query: string) => {
  return axios.get<IBackendRes<IModelPaginate<ITestcase>>>(
    `/api/v1/usecase/test_scenario/${scenarioId}/testcase?${query}`
  );
};

export const callCreateTestcase = (data: Partial<ITestcase>) => {
  console.log("callCreateTestcase", data);
  return axios.post<IBackendRes<ITestcase>>("/api/v1/usecase/test_scenario/testcase/create", data);
};

export const callUpdateTestcase = (id: number, data: Partial<ITestcase>) => {
  console.log("callUpdateTestcase", { id, data });
  return axios.put<IBackendRes<ITestcase>>(`/api/v1/usecase/test_scenario/testcase/update/${id}`, data);
};

export const callDeleteTestcase = (id: number) => {
  return axios.delete<IBackendRes<null>>(`/api/v1/usecase/test_scenario/testcase/delete/${id}`);
}

export async function callSaveSurvey(payload: any) {
  console.log("Saving survey payload to server:", payload);
  // Replace below with your API client, e.g. axios.post("/surveys", payload)
  return new Promise((res) => setTimeout(() => res({ ok: true }), 600));
}