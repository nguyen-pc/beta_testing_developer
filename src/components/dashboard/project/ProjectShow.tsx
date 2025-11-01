import React from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { callDeleteProject, callGetProject } from "../../../config/api";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchCampaignByProject } from "../../../redux/slice/CampaignSlide";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";

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
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption">{date}</Typography>
    </Box>
  );
}

export default function ProjectShow() {
  const [open, setOpen] = React.useState(false);

  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const campaigns = useAppSelector((state) => state.campaign.result);

  const buildQuery = (params, sort, filter) => {
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: "",
    };

    const clone = { ...params };
    if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
    if (clone.salary) parts.push(`salary ~ '${clone.salary}'`);
    if (clone?.level?.length) {
      parts.push(`${sfIn("level", clone.level).toString()}`);
    }

    if (!q.filter) delete q.filter;
    let temp = queryString.stringify(q);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";
    }
    if (sort && sort.salary) {
      sortBy =
        sort.salary === "ascend" ? "sort=salary,asc" : "sort=salary,desc";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend"
          ? "sort=createdAt,asc"
          : "sort=createdAt,desc";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend"
          ? "sort=updatedAt,asc"
          : "sort=updatedAt,desc";
    }

    if (!sortBy) {
      temp = `${temp}&sort=updatedAt,desc`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  // Gọi fetchUser ban đầu
  React.useEffect(() => {
    const initialQuery = buildQuery({ current: 1, pageSize: 15 }, {}, {});
    dispatch(fetchCampaignByProject({ id: projectId, query: initialQuery }));
  }, []);

  console.log("Campaigns in MainProject:", campaigns);

  const fetchProject = async (id) => {
    try {
      const res = await callGetProject(id);
      setProject(res.data);
      console.log("Fetched project:", res.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };
  console.log("Project ID from URL:", projectId);
  React.useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);
  console.log("Project data:", project);

  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleEditProject = () => {
    navigate(`/dashboard/projects/${projectId}/edit`);
  };
  const handleCreateClick = React.useCallback(() => {
    navigate("/dashboard/projects/new");
  }, [navigate]);

  const handleDetailClick = (projectId, campaignId) => {
    console.log("Project ID:", projectId);
    navigate(`/dashboard/projects/${projectId}/campaigns/${campaignId}`);
  };

  const handleCreateCampaign = () => {
    navigate(`/dashboard/projects/${projectId}/campaigns/new/create`);
  };

  const handleClick = () => {
    console.info("You clicked the filter chip.");
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProject = async () => {
    try {
      await callDeleteProject(projectId);
      setOpen(false);
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
          mb: 1,
        }}
      >
        <Button
          variant="contained"
          className="mr-2"
          size="large"
          onClick={handleEditProject}
        >
          Edit
        </Button>
        <Button variant="outlined" size="large" onClick={handleClickOpen}>
          Delete
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Project?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this project? The projects related
            to the project are deleted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDeleteProject} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={6} alignItems="center">
        {/* === Bên trái: Nội dung dự án === */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Tiêu đề Project */}
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{
                color: "text.primary",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
              }}
            >
              {project?.projectName || "Loading..."}
            </Typography>

            {/* Mô tả */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                mb: 3,
              }}
            >
              {project?.description || "Loading project description..."}
            </Typography>

            {/* Thông tin chi tiết */}
            <Box
              sx={{
                backgroundColor: "#f9fafc",
                borderRadius: 2,
                p: 2,
                mb: 3,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Start Date:</strong>{" "}
                {project?.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>End Date:</strong>{" "}
                {project?.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "—"}
              </Typography>
              {/* <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong>{" "}
                {project?.status ? (
                  <span style={{ color: "#2e7d32" }}>Active</span>
                ) : (
                  <span style={{ color: "#b71c1c" }}>Inactive</span>
                )}
              </Typography> */}
              <Typography variant="body2" color="text.secondary">
                <strong>Created by:</strong> {user?.name || "—"}
              </Typography>
            </Box>

            {/* Hành động */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              <Button
                onClick={handleCreateCampaign}
                variant="contained"
                size="large"
                sx={{
                  px: 3,
                  borderRadius: "12px",
                  textTransform: "none",
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                }}
              >
                Create Campaign
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 3,
                  borderRadius: "12px",
                  textTransform: "none",
                }}
              >
                Add Team Members
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ mt: 2, display: "block", color: "text.secondary" }}
            >
              ★★★★★ 1000+ Reviews
            </Typography>
          </Box>
        </Grid>

        {/* === Bên phải: Banner === */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            <Box
              component="img"
              src={
                project?.bannerUrl
                  ? `http://localhost:8081/storage/project-banners/${project.bannerUrl}`
                  : "https://picsum.photos/800/450?random=5"
              }
              alt={project?.projectName}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 3,
                objectFit: "cover",
              }}
            />

            {/* overlay gradient */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            />

            {/* Tên project nổi trên ảnh */}
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                bottom: 16,
                left: 20,
                color: "#fff",
                fontWeight: 600,
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              {project?.projectName}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight={700}
          mb={2}
          sx={{ color: "text.primary" }}
        >
          Campaign
        </Typography>

        {campaigns && campaigns.length > 0 ? (
          <Grid container spacing={3} columns={12}>
            {campaigns.map((campaign, index) => (
              <Grid item xs={12} md={4} key={campaign.id}>
                <StyledCard
                  onClick={() => handleDetailClick(projectId, campaign.id)}
                  variant="outlined"
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  tabIndex={0}
                  className={focusedCardIndex === index ? "Mui-focused" : ""}
                  sx={{
                    height: "400px",
                    width:"500px",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {/* Ảnh đại diện chiến dịch */}
                  <CardMedia
                    component="img"
                    alt={campaign.title}
                    image={
                      campaign.image ||
                      "https://picsum.photos/800/450?random=4"
                    }
                    sx={{
                      height: 180,
                      objectFit: "cover",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  />

                  {/* Nội dung */}
                  <StyledCardContent>
                    <Typography
                      variant="overline"
                      sx={{
                        fontSize: 12,
                        color: "primary.main",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {campaign.tag || "No tag"}
                    </Typography>

                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                      }}
                    >
                      {campaign.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.9rem",
                      }}
                    >
                      {campaign.description || "No description provided."}
                    </Typography>
                  </StyledCardContent>

                  <Author
                    authors={campaign.authors ? campaign.authors : []}
                    date={
                      campaign.startDate
                        ? new Date(campaign.startDate).toLocaleDateString()
                        : "No date"
                    }
                  />
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
              border: "2px dashed #ccc",
              borderRadius: 3,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Bạn chưa có chiến dịch nào
            </Typography>
            <Typography variant="body2" mb={2}>
              Tạo chiến dịch đầu tiên để bắt đầu kiểm thử sản phẩm.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateCampaign}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              }}
            >
              + Create New Campaign
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
