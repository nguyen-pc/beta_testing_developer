import * as React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProjectByCompany } from "../../../redux/slice/ProjectSlide";
import queryString from "query-string";
import { sfLike } from "spring-filter-query-builder";
import { callGetCompanyUsers } from "../../../config/api";

const cardData = [
  {
    img: "https://picsum.photos/800/450?random=1",
    tag: "Engineering",
    title: "Revolutionizing software development with cutting-edge tools",
    description:
      "Our latest engineering tools are designed to streamline workflows and boost productivity. Discover how these innovations are transforming the software development landscape.",
    authors: [
      { name: "Remy Sharp", avatar: "/static/images/avatar/1.jpg" },
      { name: "Travis Howard", avatar: "/static/images/avatar/2.jpg" },
    ],
  },
  {
    img: "https://picsum.photos/800/450?random=2",
    tag: "Product",
    title: "Innovative product features that drive success",
    description:
      "Explore the key features of our latest product release that are helping businesses achieve their goals. From user-friendly interfaces to robust functionality, learn why our product stands out.",
    authors: [{ name: "Erica Johns", avatar: "/static/images/avatar/6.jpg" }],
  },
  {
    img: "https://picsum.photos/800/450?random=3",
    tag: "Design",
    title: "Designing for the future: trends and insights",
    description:
      "Stay ahead of the curve with the latest design trends and insights. Our design team shares their expertise on creating intuitive and visually stunning user experiences.",
    authors: [{ name: "Kate Morrison", avatar: "/static/images/avatar/7.jpg" }],
  },
  {
    img: "https://picsum.photos/800/450?random=4",
    tag: "Company",
    title: "Our company's journey: milestones and achievements",
    description:
      "Take a look at our company's journey and the milestones we've achieved along the way. From humble beginnings to industry leader, discover our story of growth and success.",
    authors: [{ name: "Cindy Baker", avatar: "/static/images/avatar/3.jpg" }],
  },
  {
    img: "https://picsum.photos/800/450?random=45",
    tag: "Engineering",
    title: "Pioneering sustainable engineering solutions",
    description:
      "Learn about our commitment to sustainability and the innovative engineering solutions we're implementing to create a greener future. Discover the impact of our eco-friendly initiatives.",
    authors: [
      { name: "Agnes Walker", avatar: "/static/images/avatar/4.jpg" },
      { name: "Trevor Henderson", avatar: "/static/images/avatar/5.jpg" },
    ],
  },
  {
    img: "https://picsum.photos/800/450?random=6",
    tag: "Product",
    title: "Maximizing efficiency with our latest product updates",
    description:
      "Our recent product updates are designed to help you maximize efficiency and achieve more. Get a detailed overview of the new features and improvements that can elevate your workflow.",
    authors: [{ name: "Travis Howard", avatar: "/static/images/avatar/2.jpg" }],
  },
];

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

export function Search() {
  return (
    <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search",
        }}
      />
    </FormControl>
  );
}

export default function MainProject() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.account.user);
  const projects = useAppSelector((state) => state.project.result);
  const [company, setCompany] = React.useState<any>(null);
  React.useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!user?.id) return;
        const res = await callGetCompanyUsers(user.id);
        if (res?.data) {
          console.log("✅ Company fetched:", res.data);
          setCompany(res.data);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy companyProfile:", error);
      }
    };
    fetchCompany();
  }, [user]);

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

  React.useEffect(() => {
    if (!company?.id) return; // ✅ tránh gọi khi company chưa có

    const initialQuery = buildQuery({ current: 1, pageSize: 15 }, {}, {});
    console.log("📦 Fetching projects for company:", company.id);
    dispatch(fetchProjectByCompany({ id: company.id, query: initialQuery }));
  }, [company, dispatch]);

  console.log("Projects in MainProject:", projects);

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Typography variant="h1" gutterBottom>
            Project
          </Typography>
          <Typography>
            Stay in the loop with the latest about our products
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
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "row",
          gap: 1,
          width: { xs: "100%", md: "fit-content" },
          overflow: "auto",
        }}
      >
        <Search />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "start", md: "center" },
          gap: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            gap: 3,
            overflow: "auto",
          }}
        >
          <Chip onClick={handleClick} size="medium" label="All categories" />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Company"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Product"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Design"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Engineering"
            sx={{
              backgroundColor: "transparent",
              border: "none",
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "row",
            gap: 1,
            width: { xs: "100%", md: "fit-content" },
            overflow: "auto",
          }}
        >
          <Search />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>
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
                sx={{ height: "100%" }}
              >
                <CardMedia
                  component="img"
                  alt={project.projectName}
                  image={project.image ? project.image : cardData[2].img}
                  sx={{
                    height: { sm: "auto", md: "50%" },
                    aspectRatio: { sm: "16 / 9", md: "" },
                  }}
                />
                <StyledCardContent>
                  <Typography gutterBottom variant="caption" component="div">
                    {project.tag ? project.tag : "No tag"}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {project.projectName}
                  </Typography>
                  <StyledTypography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {project.description}
                  </StyledTypography>
                </StyledCardContent>
                <Author
                  authors={project.authors ? project.authors : []}
                  date={project.startDate ? project.startDate : ""}
                />
              </StyledCard>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
