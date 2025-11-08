import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { callGetTestExecutionsByCampaign } from "../../../../config/api";

import FilterBar from "./FilterBar";
import SummaryHeader from "./SummaryHeader";
import TestcaseByUser from "./TestcaseByUser";
import TestcaseByCase from "./TestcaseByCase";

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
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "user" | "testcase">("overview");
  const [statusFilter, setStatusFilter] = useState<"all" | "passed" | "failed">(
    "all"
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callGetTestExecutionsByCampaign(Number(campaignId));
        const data = res.data?.data || res.data || [];
        setExecutions(data);
      } catch (err) {
        console.error("Error fetching test executions:", err);
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) fetchData();
  }, [campaignId]);

  // Filter + Search
  const filteredData = useMemo(() => {
    let filtered = executions;
    if (statusFilter !== "all") {
      filtered = filtered.filter((i) =>
        statusFilter === "passed" ? i.status : !i.status
      );
    }
    if (search.trim()) {
      filtered = filtered.filter((i) =>
        i.testCaseTitle.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [executions, statusFilter, search]);

  // --------------------- UI ---------------------
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
         Quản lý Kết quả Testcase
      </Typography>

      {/* Tabs chính */}
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

      {/* Bộ lọc (ẩn khi đang ở tab “Tổng quan”) */}
      {tab !== "overview" && (
        <FilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      {/* Nội dung các tab */}
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
