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
  type ISurvey,
  type IQuestion,
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
  return axios.get<IBackendRes<ICampaign>>(`/api/v1/campaign/${id}`);
};
export const callCreateCampaign = (data: ICampaign) => {
  console.log("callCreateCampaign", data);
  return axios.post<IBackendRes<ICampaign>>("/api/v1/campaign/create", data);
};

export const callUpdateCampaign = (id: number, data: ICampaign) => {
  console.log("callUpdateCampaign", { id, data });
  return axios.put<IBackendRes<ICampaign>>(
    `/api/v1/campaign/update/${id}`,
    data
  );
};

// Module Campaign
export const callGetUseCasesByCampaign = (
  campaignId: string,
  query: string
) => {
  return axios.get<IBackendRes<IModelPaginate<IUseCase>>>(
    `/api/v1/usecase/campaign/${campaignId}?${query}`
  );
};

export const callCreateUseCase = (data: Partial<IUseCase>) => {
  return axios.post<IBackendRes<IUseCase>>("/api/v1/usecase/create", data);
};

export const callUpdateUseCase = (id: number, data: Partial<IUseCase>) => {
  return axios.put<IBackendRes<IUseCase>>(`/api/v1/usecase/update/${id}`, data);
};

export const callDeleteUseCase = (id: number) => {
  return axios.delete<IBackendRes<null>>(`/api/v1/usecase/delete/${id}`);
};

// Module Scenario
export const callGetScenariosByUseCase = (useCaseId: number, query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IScenario>>>(
    `/api/v1/usecase/${useCaseId}/test_scenario?${query}`
  );
};

export const callCreateScenario = (data: IScenario) => {
  console.log("callCreateScenario", data);
  return axios.post<IBackendRes<IScenario>>(
    "/api/v1/usecase/test_scenario/create",
    data
  );
};

export const callUpdateScenario = (id: number, data: Partial<IScenario>) => {
  console.log(data, id);
  return axios.put<IBackendRes<IScenario>>(
    `/api/v1/usecase/test_scenario/update/${id}`,
    data
  );
};

export const callDeleteScenario = (id: number) => {
  return axios.delete<IBackendRes<null>>(
    `/api/v1/usecase/test_scenario/delete/${id}`
  );
};

// Module Testcase
export const callGetTestcasesByScenario = (
  scenarioId: string,
  query: string
) => {
  return axios.get<IBackendRes<IModelPaginate<ITestcase>>>(
    `/api/v1/usecase/test_scenario/${scenarioId}/testcase?${query}`
  );
};

export const callCreateTestcase = (data: Partial<ITestcase>) => {
  console.log("callCreateTestcase", data);
  return axios.post<IBackendRes<ITestcase>>(
    "/api/v1/usecase/test_scenario/testcase/create",
    data
  );
};

export const callUpdateTestcase = (id: number, data: Partial<ITestcase>) => {
  console.log("callUpdateTestcase", { id, data });
  return axios.put<IBackendRes<ITestcase>>(
    `/api/v1/usecase/test_scenario/testcase/update/${id}`,
    data
  );
};

export const callDeleteTestcase = (id: number) => {
  return axios.delete<IBackendRes<null>>(
    `/api/v1/usecase/test_scenario/testcase/delete/${id}`
  );
};

export async function callCreateSurvey(campaignId: string, data: ISurvey) {
  console.log("Creating survey on server:", data);
  return axios.post<IBackendRes<ISurvey>>(
    `/api/v1/campaign/${campaignId}/survey`,
    data
  );
}

// question
export async function callCreateQuestion(
  projectId: string,
  campaignId: string,
  surveyId: string,
  data: Partial<IQuestion>
) {
  console.log("Creating question on server:", data);
  return axios.post<IBackendRes<IQuestion>>(
    `/api/v1/project/${projectId}/campaign/${campaignId}/survey/${surveyId}/question`,
    data
  );
}

export async function callDeleteQuestion(
  projectId: string,
  campaignId: string,
  surveyId: string,
  questionId: string
) {
  console.log("Deleting question on server:", questionId);
  return axios.delete<IBackendRes<null>>(
    `/api/v1/project/${projectId}/campaign/${campaignId}/survey/${surveyId}/question/${questionId}`
  );
}

//recruiting campaign
export async function callCreateRecruitingCampaign(data: ICampaign) {
  console.log("callCreateRecruitingCampaign", data);
  return axios.post<IBackendRes<ICampaign>>(
    "/api/v1/recruit-profile/create",
    data
  );
}

//tester status

export async function callGetAllTesterRegister(
  campaignId: string,
  query: string
) {
  console.log("Fetching all tester registrations for campaign:", campaignId);
  return axios.get<IBackendRes<IModelPaginate<any>>>(
    `/api/v1/campaign/${campaignId}/testers?${query}`
  );
}

export async function callGetStatistics(campaignId: string) {
  console.log("Fetching statistics for campaign:", campaignId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/tester-campaign/stats`
  );
}

export async function callApproveTester(testerCampaignId: string) {
  console.log("Approving tester:", testerCampaignId);
  return axios.put<IBackendRes<null>>(
    `/api/v1/campaign/tester-campaign/${testerCampaignId}/approve`
  );
}

export async function callRejectTester(testerCampaignId: string) {
  console.log("Rejecting tester:", testerCampaignId);
  return axios.put<IBackendRes<null>>(
    `/api/v1/campaign/tester-campaign/${testerCampaignId}/reject`
  );
}

// form

export async function callGetSurvey(campaignId: string, surveyId: string) {
  console.log("Fetching survey details for survey:", surveyId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}`
  );
}

export async function callGetSurveysByCampaign(campaignId: string) {
  console.log("Fetching all surveys for campaign:", campaignId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey`
  );
}
export async function callGetForm(campaignId: string, surveyId: string) {
  console.log("Fetching survey form for survey:", surveyId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}/question/all`
  );
}

export async function callSubmitForm(
  campaignId: string,
  surveyId: string,
  data: any
) {
  console.log("Submitting survey form for survey:", surveyId, data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}/response`,
    data
  );
}

export async function callCreateTesterSurvey(data: any) {
  console.log("callCreateTesterSurvey", data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/campaign/tester-survey/create`,
    data
  );
}

// bug report
export async function callGetBugReports(query: string) {
  console.log("Fetching bug reports:", query);
  return axios.get<IBackendRes<IModelPaginate<any>>>(
    `/api/v1/bugs/filter?${query}`
  );
}
export async function callGetDetailBugReport(bugId: string) {
  console.log("Fetching bug report detail:", bugId);
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/${bugId}`);
}

//chat

export async function callGetBugChatMessages(bugId: string) {
  console.log("Fetching bug chat messages for bug:", bugId);
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/${bugId}/chat`);
}

export async function callPostBugChatMessage(bugId: string, data: any) {
  console.log("Posting bug chat message for bug:", bugId, data);
  return axios.post<IBackendRes<any>>(`/api/v1/bugs/${bugId}/chat`, data);
}

// survey result
export async function callGetSurveyResults(surveyId: string) {
  console.log("Fetching survey results for survey:", surveyId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/tester-survey/survey/${surveyId}`
  );
}

export async function callGetQuestionResponses(questionId: string) {
  console.log("Fetching question responses for question:", questionId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/question/${questionId}/responses`
  );
}

export async function callGetQuestionSurvey(campaignId: string, surveyId: string) {
  console.log("Fetching question survey for campaign:", campaignId, "and survey:", surveyId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}/question/all`
  );
}
