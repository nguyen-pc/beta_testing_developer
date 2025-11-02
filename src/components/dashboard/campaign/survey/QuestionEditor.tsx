import React, { use, useState } from "react";
import {
  TextField,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { callCreateQuestion, callDeleteQuestion } from "../../../../config/api";
import { useParams } from "react-router-dom";

interface QuestionEditorProps {
  question: any;
  onChange: (updated: any) => void;
  onDelete: () => void;
}

export default function QuestionEditor({
  question,
  onChange,
  onDelete,
}: QuestionEditorProps) {
  const [isCreated, setIsCreated] = useState(false);
  const { projectId, campaignId, surveyId } = useParams();
  const [isRequired, setIsRequired] = useState(question.isRequired || false);
  const [questionName, setQuestionName] = useState(question.questionName || "");
  const [questionType, setQuestionType] = useState(question.type || "TEXT");
  const [options, setOptions] = useState<string[]>(question.options || []);

  const [questionId, setQuestionId] = useState<string | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
    onChange({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange({ options: newOptions });
  };

  const handleDeleteQuestion = async () => {
    try {
      if (isCreated && questionId) {
        await callDeleteQuestion(projectId, campaignId, surveyId, questionId);
      }
      onDelete(); // Xóa trong giao diện
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const handleCreateQuestion = async () => {
    const payload = {
      questionName: questionName || "Untitled Question",
      questionType:
        questionType === "short-text"
          ? "TEXT"
          : questionType === "long-text"
          ? "LONG_TEXT"
          : questionType === "multiple-choice"
          ? "MULTIPLE_CHOICE"
          : questionType === "multiple-checkbox"
          ? "CHECKBOX"
          : questionType === "file-upload"
          ? "FILE_UPLOAD"
          : "TEXT",
      isRequired: isRequired,
      choices:
        questionType === "multiple-choice" ||
        questionType === "multiple-checkbox"
          ? options.map((opt) => ({ choiceText: opt || "Lựa chọn" }))
          : [],
    };

    console.log("Question payload:", payload);
    try {
      const res = await callCreateQuestion(
        projectId,
        campaignId,
        surveyId,
        payload
      );
      setIsCreated(true);
      setQuestionId(res.data.questionId);
      console.log("Question created on server:", res.data.questionId);
    } catch (err) {
      console.error("Error creating question:", err);
    }
  };

  return (
    <div className="p-3 border rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Câu hỏi</h4>
        <IconButton
          disabled={isCreated}
          onClick={onDelete}
          size="small"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>

      <TextField
        label="Nội dung câu hỏi"
        fullWidth
        size="small"
        value={questionName}
        onChange={(e) => setQuestionName(e.target.value)}
        className="mb-2"
        disabled={isCreated}
      />

      {(questionType === "multiple-choice" ||
        questionType === "multiple-checkbox") && (
        <div className="ml-2 mb-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 mt-2">
              <TextField
                size="small"
                value={opt}
                placeholder={`Lựa chọn ${i + 1}`}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleRemoveOption(i)}
              >
                Xóa
              </Button>
            </div>
          ))}
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddOption}
            disabled={isCreated}
          >
            + Thêm lựa chọn
          </Button>
        </div>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            disabled={isCreated}
          />
        }
        label="Bắt buộc trả lời"
      />

      <div className="mt-3">
        {!isCreated ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateQuestion}
          >
            Tạo câu hỏi
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteQuestion}
          >
            Xóa câu hỏi
          </Button>
        )}
      </div>
    </div>
  );
}
