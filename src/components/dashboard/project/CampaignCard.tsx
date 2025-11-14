import React from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  styled,
  AvatarGroup,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
} from "@mui/material";
import parse from "html-react-parser";

export interface CampaignCardProps {
  campaign: any;
  projectId?: number | string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void; // callback từ parent
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  cursor: "pointer",
  borderRadius: 12,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    transform: "translateY(-3px)",
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

export default function CampaignCard({
  campaign,
  onClick,
  onEdit,
  onDelete,
}: CampaignCardProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation(); // tránh click vào card
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

  const handleConfirmDelete = () => {
    setOpen(false);
    onDelete?.(); // gọi callback từ parent
  };

  return (
    <Grid item size={{xs:12, md:6, lg:4}}>
      <StyledCard onClick={onClick} sx={{ position: "relative" }}>
        {/* Banner */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            alt={campaign.title}
            image={
              campaign?.bannerUrl
                ? `http://localhost:8081/storage/project-banners/${campaign.bannerUrl}`
                : "https://picsum.photos/800/450?random=2"
            }
            sx={{
              height: 180,
              objectFit: "cover",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />

          {/* Status Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor:
                campaign.campaignStatus === "PENDING"
                  ? "rgba(255, 193, 7, 0.9)"
                  : campaign.campaignStatus === "APPROVED"
                  ? "rgba(76, 175, 80, 0.9)"
                  : campaign.campaignStatus === "IN_PROGRESS"
                  ? "rgba(33, 150, 243, 0.9)"
                  : campaign.campaignStatus === "COMPLETED"
                  ? "rgba(156, 39, 176, 0.9)"
                  : campaign.campaignStatus === "REJECTED"
                  ? "rgba(244, 67, 54, 0.9)"
                  : "rgba(158, 158, 158, 0.8)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {campaign.campaignStatus || "DRAFT"}
          </Box>

          {/* Draft badge */}
          {campaign.draft && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: "rgba(103, 58, 183, 0.9)",
                color: "white",
                px: 1.2,
                py: 0.4,
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Draft
            </Box>
          )}
        </Box>

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
            {campaign?.campaignType?.name || "No tag"}
          </Typography>

          <Typography
            gutterBottom
            variant="h6"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
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
              fontSize: "0.9rem",
            }}
          >
            {campaign.description
              ? parse(campaign.description)
              : "No description provided."}
          </Typography>
        </StyledCardContent>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 1,
            px: 2,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: 2 }}
            onClick={onEdit}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{ textTransform: "none", borderRadius: 2 }}
            onClick={handleOpenDialog}
          >
            Delete
          </Button>
        </Box>

        {/* Author */}
        <Author
          authors={campaign.authors || []}
          date={
            campaign.startDate
              ? new Date(campaign.startDate).toLocaleDateString()
              : "No date"
          }
        />
      </StyledCard>

      {/* Confirm Delete Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Xoá Campaign?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xoá chiến dịch này? Hành động này không thể hoàn
            tác.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
