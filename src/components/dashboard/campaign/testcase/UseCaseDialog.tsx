import * as React from "react";
import { Button, TextField } from "@mui/material";
import { validate as ValidateUseCase, type UseCase } from "../../../../data/usecase";

interface Props {
  initialData: UseCase | null;
  onSave: (data: Partial<UseCase>) => void;
  onCancel: () => void;
}

export default function UseCaseDialog({ initialData, onSave, onCancel }: Props) {
  const [values, setValues] = React.useState<Partial<UseCase>>(
    initialData || { name: "", description: "", status: true }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (field: keyof UseCase, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { issues } = ValidateUseCase(values);
    if (issues.length > 0) {
      setErrors(Object.fromEntries(issues.map((i) => [i.path[0], i.message])));
      return;
    }
    console.log("Use case data to save:", values);
    onSave(values);
  };

  return (
    <div className="flex flex-col gap-4 py-2">
      <TextField
        label="Name"
        value={values.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
      />
      <TextField
        label="Description"
        value={values.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
        error={!!errors.description}
        helperText={errors.description}
        fullWidth
        multiline
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
