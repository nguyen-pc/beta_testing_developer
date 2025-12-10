import * as React from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputAdornment,
  OutlinedInput,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProjectByCompany } from "../../../redux/slice/ProjectSlide";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import { callGetCompanyUsers } from "../../../config/api";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

function Author({
  authors,
  date,
}: {
  authors: { name: string; avatar: string }[];
  date: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((a) => a.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption">{date}</Typography>
    </Box>
  );
}

export default function MainProject() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const projects = useAppSelector((state) => state.project.result);
  const [company, setCompany] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!user?.id) return;
        const res = await callGetCompanyUsers(user.id);
        if (res?.data) setCompany(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy companyProfile:", error);
      }
    };
    fetchCompany();
  }, [user]);

  const buildQuery = (params, sort, filter, searchValue = "") => {
    const q = { page: params.current, size: params.pageSize, filter: "" };
    if (searchValue) q.filter = sfLike("projectName", searchValue).toString();
    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);
    temp += "&sort=updatedAt,desc";
    return temp;
  };

  // ✅ Debounce tìm kiếm (chỉ gọi API sau khi ngừng nhập 500ms)
  React.useEffect(() => {
    if (!company?.id) return;
    const timeout = setTimeout(() => {
      const query = buildQuery(
        { current: 1, pageSize: 15 },
        {},
        {},
        searchTerm
      );
      dispatch(fetchProjectByCompany({ id: company.id, query }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [company, searchTerm, dispatch]);

  const handleFocus = (index: number) => setFocusedCardIndex(index);
  const handleBlur = () => setFocusedCardIndex(null);

  const handleCreateClick = () => navigate("/dashboard/projects/new");
  const handleDetailClick = (id) => navigate(`/dashboard/projects/show/${id}`);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Typography variant="h1" gutterBottom>
            Project
          </Typography>
          <Typography>
            Stay updated with the latest improvements and features of our
            BetaTesting platform.
          </Typography>
        </div>
        <div>
          <Button
            onClick={handleCreateClick}
            variant="contained"
            color="primary"
          >
            Create New Project
          </Button>
        </div>
      </div>

      {/* 🔍 Search bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: { xs: "100%", md: "30ch" },
        }}
      >
        <FormControl fullWidth variant="outlined">
          <OutlinedInput
            size="small"
            placeholder="Search project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            }
          />
        </FormControl>
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>

      {/* 🧩 Grid hiển thị project */}
      <Grid container spacing={2} columns={12}>
        {projects &&
          projects.map((project, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={project.id}>
              <StyledCard
                onClick={() => handleDetailClick(project.id)}
                variant="outlined"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? "Mui-focused" : ""}
              >
                <CardMedia
                  component="img"
                  alt={project.projectName}
                  image={
                    project?.bannerUrl
                      ? `http://localhost:8081/storage/project-banners/${project.bannerUrl}`
                      : "https://picsum.photos/800/450?random=5"
                  }
                  sx={{
                    height: { sm: "auto", md: "50%" },
                    aspectRatio: "16 / 9",
                  }}
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="caption">
                    {project.tag || "No tag"}
                  </Typography>
                  <Typography gutterBottom variant="h6">
                    {project.projectName}
                  </Typography>
                  <StyledTypography variant="body2" color="text.secondary">
                    {project.description}
                  </StyledTypography>
                </StyledCardContent>
                <Author
                  authors={project.authors || []}
                  date={project.startDate || ""}
                />
              </StyledCard>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
