import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";

import {
  callGetProjectByCampaign,
  callGetTestExecutionsByCampaign,
  callGetUseCasesByCampaign,
} from "../../../../config/api";

import FilterBar from "./FilterBar";
import SummaryHeader from "./SummaryHeader";
import TestcaseByUser from "./TestcaseByUser";
import TestcaseByCase from "./TestcaseByCase";
import ExportExcel from "./ExportExcel";

export interface TestExecution {
  id: number;
  note: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  campaignId: number;
  campaignTitle: string;
  userId: number;
  userEmail: string;
  testCaseId: number;
  testCaseTitle: string;
}

const TestcaseHome: React.FC = () => {
  const { campaignId } = useParams();

  const [executions, setExecutions] = useState<TestExecution[]>([]);
  const [useCases, setUseCases] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "user" | "testcase">("overview");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "passed" | "failed"
  >("all");
  const [search, setSearch] = useState("");

  // ---------------------------------------------
  // Load data
  // ---------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resExec = await callGetTestExecutionsByCampaign(
          Number(campaignId)
        );
        setExecutions(resExec.data || []);

        const resUC = await callGetUseCasesByCampaign(Number(campaignId));
        setUseCases(resUC.data?.result || []);
        console.log("resUC", resUC);

        const resProject = await callGetProjectByCampaign(Number(campaignId));
        setProject(resProject.data || null);
      } catch (err) {
        console.error("Error fetching data: ", err);
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) fetchData();
  }, [campaignId]);

  // ---------------------------------------------
  // Filter + Search
  // ---------------------------------------------
  const filteredData = useMemo(() => {
    let data = executions;

    if (statusFilter !== "all") {
      data = data.filter((i) =>
        statusFilter === "passed" ? i.status : !i.status
      );
    }

    if (search.trim()) {
      data = data.filter((i) =>
        i.testCaseTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [executions, statusFilter, search]);

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <Box sx={{ p: 4 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Quản lý Kết quả Testcase
        </Typography>

        {/* ---------------- Export Excel button ---------------- */}
        {project && useCases.length > 0 && (
          <ExportExcel
            project={project}
            useCases={useCases}
            executions={executions}
          />
        )}
      </Grid>

      {/* ---------------- Tabs ---------------- */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Tổng quan" value="overview" />
        <Tab label="Theo người dùng" value="user" />
        <Tab label="Theo Testcase" value="testcase" />
      </Tabs>

      {/* ---------------- Filter ---------------- */}
      {tab !== "overview" && (
        <FilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      {/* ---------------- Content ---------------- */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tab === "overview" && <SummaryHeader data={filteredData} />}
          {tab === "user" && <TestcaseByUser data={filteredData} />}
          {tab === "testcase" && <TestcaseByCase data={filteredData} />}
        </>
      )}
    </Box>
  );
};

export default TestcaseHome;
