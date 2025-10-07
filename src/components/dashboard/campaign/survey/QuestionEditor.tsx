import React, { useState } from "react";
import { TextField, IconButton, Button, Checkbox, FormControlLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface QuestionEditorProps {
  question: any;
  onChange: (updated: any) => void;
  onDelete: () => void;
}

export default function QuestionEditor({ question, onChange, onDelete }: QuestionEditorProps) {
  const [isRequired, setIsRequired] = useState(question.isRequired || false);
  const [questionName, setQuestionName] = useState(question.questionName || "");
  const [questionType, setQuestionType] = useState(question.type || "TEXT");
  const [options, setOptions] = useState<string[]>(question.options || []);

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

  const handleCreateQuestion = () => {
    const payload = {
      questionName: questionName || "Untitled Question",
      questionType:
        questionType === "short-text"
          ? "TEXT"
          : questionType === "long-text"
          ? "TEXT"
          : questionType === "multiple-choice"
          ? "MULTIPLE_CHOICE"
          : "TEXT",
      isRequired: isRequired,
      choices:
        questionType === "multiple-choice"
          ? options.map((opt) => ({ choiceText: opt || "Lựa chọn" }))
          : [],
    };

    console.log("Question payload:", payload);
  };

  return (
    <div className="p-3 border rounded-md bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Câu hỏi</h4>
        <IconButton onClick={onDelete} size="small" color="error">
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
      />

      {questionType === "multiple-choice" && (
        <div className="ml-2 mb-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <TextField
                size="small"
                value={opt}
                placeholder={`Lựa chọn ${i + 1}`}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
              <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveOption(i)}>
                Xóa
              </Button>
            </div>
          ))}
          <Button variant="outlined" size="small" onClick={handleAddOption}>
            + Thêm lựa chọn
          </Button>
        </div>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
          />
        }
        label="Bắt buộc trả lời"
      />

      <div className="mt-3">
        <Button variant="contained" color="primary" onClick={handleCreateQuestion}>
          Tạo câu hỏi
        </Button>
      </div>
    </div>
  );
}
