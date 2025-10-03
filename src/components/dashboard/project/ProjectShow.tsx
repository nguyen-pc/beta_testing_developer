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

  const handleDetailClick = (id) => {
    console.log("Project ID:", id);
    navigate(`/dashboard/projects/show/${id}`);
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

  const handleDeleteProject = async() => {
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
        <Button variant="contained" className="mr-2" size="large" onClick={handleEditProject}>
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
        {/* Bên trái - nội dung */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {project ? project.projectName : "Loading..."}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {project ? project.description : "Loading project description..."}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" size="large">
              Create Campaign
            </Button>
            <Button variant="outlined" size="large">
              Add Team Members
            </Button>
          </Box>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 2 }}
            color="text.secondary"
          >
            ★★★★★ 1000+ Reviews
          </Typography>
        </Grid>

        {/* Bên phải - hình ảnh */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="data:image/jpeg;base64,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"
            alt="Dashboard Preview"
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>
      <Box>
        <Typography variant="h5" component="h2">
          Campaign
        </Typography>
        <Grid container spacing={2} columns={12}>
          {campaigns &&
            campaigns.map((campaign, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={campaign.id}>
                <StyledCard
                  onClick={() => handleDetailClick(campaign.id)}
                  variant="outlined"
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  tabIndex={0}
                  className={focusedCardIndex === index ? "Mui-focused" : ""}
                  sx={{ height: "100%" }}
                >
                  <CardMedia
                    component="img"
                    alt={campaign.title}
                    image={campaign.image ? campaign.image : ""}
                    sx={{
                      height: { sm: "auto", md: "50%" },
                      aspectRatio: { sm: "16 / 9", md: "" },
                    }}
                  />
                  <StyledCardContent>
                    <Typography gutterBottom variant="caption" component="div">
                      {campaign.tag ? campaign.tag : "No tag"}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                      {campaign.title}
                    </Typography>
                    <StyledTypography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {campaign.description}
                    </StyledTypography>
                  </StyledCardContent>
                  <Author
                    authors={campaign.authors ? campaign.authors : []}
                    date={campaign.startDate ? campaign.startDate : ""}
                  />
                </StyledCard>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
}
