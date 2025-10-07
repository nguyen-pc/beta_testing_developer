import * as React from "react";
import { Button, TextField } from "@mui/material";
import {
  validate as ValidateScenario,
  type Scenario,
} from "../../../../data/testscenario";

interface Props {
  initialData: Scenario | null;
  onSave: (data: Partial<Scenario>) => void;
  onCancel: () => void;
}

export default function ScenarioDialog({
  initialData,
  onSave,
  onCancel,
}: Props) {
  const [values, setValues] = React.useState<Partial<Scenario>>(
    initialData || { title: "", description: "", precondition: "" }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Cập nhật form khi initialData thay đổi (khi click Edit)
  React.useEffect(() => {
    if (initialData) {
      setValues(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof Scenario, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Nếu bạn chưa có ValidateScenario, có thể bỏ qua phần này
    const { issues } = ValidateScenario
      ? ValidateScenario(values)
      : { issues: [] };
    if (issues.length > 0) {
      setErrors(Object.fromEntries(issues.map((i) => [i.path[0], i.message])));
      return;
    }

    console.log("Scenario data to save:", values);
    onSave(values);
  };

  console.log(values)

return (
  <div className="space-y-4 py-2">
    <TextField
      variant="outlined"
      margin="normal"
      label="Scenario Name"
      value={values.title || ""}
      onChange={(e) => handleChange("title", e.target.value)}
      error={!!errors.title}
      helperText={errors.title}
      fullWidth
    />

    <TextField
      variant="outlined"
      margin="normal"
      label="Description"
      value={values.description || ""}
      onChange={(e) => handleChange("description", e.target.value)}
      error={!!errors.description}
      helperText={errors.description}
      fullWidth
      multiline
      minRows={3}
      sx={{
        "& .MuiInputBase-root": { alignItems: "flex-start" },
      }}
    />

    <TextField
      variant="outlined"
      margin="normal"
      label="Precondition"
      value={values.precondition || ""}
      onChange={(e) => handleChange("precondition", e.target.value)}
      error={!!errors.precondition}
      helperText={errors.precondition}
      fullWidth
      multiline
      minRows={2}
      sx={{
        "& .MuiInputBase-root": { alignItems: "flex-start" },
      }}
    />

    <div className="flex justify-end gap-2 mt-4">
      <Button onClick={onCancel}>Cancel</Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  </div>
);
}
