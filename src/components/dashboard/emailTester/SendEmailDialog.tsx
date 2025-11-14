import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { callSendInvitationEmail } from "../../../config/api";

interface SendEmailDialogProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  onSent?: () => void;
}

const SendEmailDialog: React.FC<SendEmailDialogProps> = ({
  open,
  onClose,
  campaignId,
  onSent,
}) => {
  const [emailContent, setEmailContent] = useState("");
  const [sending, setSending] = useState(false);

  // ---------------- Gửi email tùy chỉnh ----------------
  const handleSendCustom = async () => {
    if (!emailContent.trim()) {
      alert("⚠️ Please enter email content!");
      return;
    }
    await sendEmailRequest({ content: emailContent });
  };

  // ---------------- Gửi email template mặc định ----------------
  const handleSendTemplate = async () => {
    await sendEmailRequest({}); // không gửi nội dung
  };

  // ---------------- Logic chung gọi API ----------------
  const sendEmailRequest = async (data: any) => {
    try {
      setSending(true);
      await callSendInvitationEmail(campaignId, data);
      alert("Emails sent successfully!");
      setEmailContent("");
      onClose();
      if (onSent) onSent();
    } catch (error) {
      console.error(" Error sending email:", error);
      alert("Failed to send emails!");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Send Email Invitation</DialogTitle>
      <DialogContent>
        <div className="flex justify-between mb-2">
          <Typography variant="body2" mb={1}>
            Enter the content of the invitation email:
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            disabled={sending}
            onClick={handleSendTemplate}
          >
            {sending ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} /> Sending...
              </>
            ) : (
              "Send Template"
            )}
          </Button>
        </div>

        <ReactQuill
          theme="snow"
          value={emailContent}
          onChange={setEmailContent}
          style={{ height: "250px", marginBottom: "50px" }}
          placeholder="Write your custom email content..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={sending}
          onClick={handleSendCustom}
        >
          {sending ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} /> Sending...
            </>
          ) : (
            "Send Custom"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendEmailDialog;
