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

export const callGetCompanyUsers = (userId: string) => {
  console.log("callGetCompanyUsers", { userId });
  return axios.get<IBackendRes<any>>(`/api/v1/company/user/${userId}`);
};

export const callUpdateCompany = (companyId: string, data: any) => {
  console.log("callUpdateCompany", { companyId, data });
  return axios.put<IBackendRes<any>>(
    `/api/v1/company/update/${companyId}`,
    data
  );
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

export const callPublishCampaign = (id: number) => {
  console.log("callPublishCampaign", { id });
  return axios.put<IBackendRes<ICampaign>>(`/api/v1/campaign/${id}/publish`);
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

export async function callGetTesterStatus(campaignId: string) {
  console.log("Fetching tester status for campaign:", campaignId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/analytics`
  );
}

export async function callUpdateProgressTester(testerCampaignId: string, data: any) {
  console.log("Fetching tester recruiting results for campaign:", testerCampaignId);
  return axios.put<IBackendRes<any>>(
    `/api/v1/campaign/tester-campaign/${testerCampaignId}/progress`,
    data
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
  return axios.get<IBackendRes<any>>(`/api/v1/campaign/${campaignId}/survey`);
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

export async function callGetQuestionSurvey(
  campaignId: string,
  surveyId: string
) {
  console.log(
    "Fetching question survey for campaign:",
    campaignId,
    "and survey:",
    surveyId
  );
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}/question/all`
  );
}

export async function callGetResponseByQuestion(questionId: string) {
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/question/${questionId}/responses`
  );
}

//email tester
export async function callSendEmailToTester(campaignId: string, data: any) {
  console.log("Sending email to tester for campaign:", campaignId, data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/send-invite-email`,
    data
  );
}

export async function callGetEmailTesterCampaign(campaignId: string) {
  console.log("Getting email tester for campaign:", campaignId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/email-testers/campaign/${campaignId}`
  );
}

export async function callUploadEmailTesters(campaignId: string, data: any) {
  console.log("Uploading email testers for campaign:", campaignId, data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/email-testers/campaign/${campaignId}`,
    data
  );
}

export async function callSendInvitationEmail(campaignId: string, data: any) {
  console.log("Sending invitation email for campaign:", campaignId, data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/email-testers/campaign/${campaignId}/send`,
    data
  );
}

// Upload File Attachment
export const uploadRecording = (
  file: any,
  folderType: string,
  uploader: string
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("folder", folderType);
  bodyFormData.append("uploader", uploader);

  return axios<IBackendRes<{ fileName: string }>>({
    method: "post",
    url: "/api/v1/attachment",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadFileSurvey = (
  file: any,
  surveyId: number,
  uploaderId: number
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("folder", surveyId.toString());
  bodyFormData.append("uploader", uploaderId.toString());

  return axios.post<IBackendRes<{ fileName: string }>>(
    "/api/v1/files",
    bodyFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const callGetFileSurvey = (surveyId: number) => {
  console.log("callGetFileSurvey", { surveyId });
  return axios.get<IBackendRes<any>>(`/api/v1/files/${surveyId}/list`);
};

export const callGetVideoFilesByCampaign = (campaignId: number) => {
  console.log("callGetVideoFilesByCampaign", { campaignId });
  return axios.get<IBackendRes<any>>(
    `/api/v1/attachment/campaign/${campaignId}/videos`
  );
};

//dashboard stats

export const callGetBugTrendBySeverity = (campaignId: number) => {
  console.log("callGetBugTrendBySeverity", { campaignId });
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/bug-trend/${campaignId}`);
};

export const callGetCompletionStats = (campaignId: number) => {
  console.log("callGetCompletionStats", { campaignId });
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/completion`
  );
};

export const sendChatMessage = (data: {
  sessionId: string;
  message: string;
  userId: number;
}) => {
  console.log("sendChatMessage", data);
  return axios.post<IBackendRes<any>>(`/api/v1/chatbot/ask`, data);
};

export const startChatSession = (userId: number, topic = "New Chat") => {
  return axios.post<IBackendRes<any>>("/api/v1/chatbot/session/start", {
    userId,
    topic,
  });
};

export const getChatHistory = (sessionId: string, userId: number) => {
  return axios.get<IBackendRes<any>>(
    `/api/v1/chatbot/session/${sessionId}/history`,
    {
      params: { userId: userId },
    }
  );
};

export const saveChatHistory = (data: {
  sessionId: string;
  mode: "user" | "assistant";
  question: string;
  answer: string;
}) => {
  return axios.post<IBackendRes<any>>("/api/v1/chatbot/session/save", {
    sessionUuid: data.sessionId, // map đúng key BE
    mode: data.mode,
    question: data.question,
    answer: data.answer,
  });
};

export const getUserSessions = (userId: number) => {
  return axios.get<IBackendRes<any>>(`/api/v1/chatbot/session/list`, {
    params: { userId: userId },
  });
};
