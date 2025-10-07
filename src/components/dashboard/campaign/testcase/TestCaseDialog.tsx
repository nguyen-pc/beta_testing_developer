import * as React from "react";
import { Button, TextField, FormControlLabel, Switch } from "@mui/material";
import { type Testcase } from "../../../../data/testcase";

interface Props {
  initialData: Testcase | null;
  onSave: (data: Partial<Testcase>) => void;
  onCancel: () => void;
}

export default function TestcaseDialog({ initialData, onSave, onCancel }: Props) {
  const [form, setForm] = React.useState<Partial<Testcase>>(
    initialData || {
      title: "",
      description: "",
      preCondition: "",
      dataTest: "",
      steps: "",
      expectedResult: "",
      status: "",
    }
  );

  const handleChange =
    (field: keyof Testcase) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

//   const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, status: e.target.checked });
//   };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <TextField
        label="Test Case Name"
        value={form.title}
        onChange={handleChange("title")}
        fullWidth
        required
      />
      <TextField
        label="Description"
        value={form.description}
        onChange={handleChange("description")}
        fullWidth
        multiline
      />
      <TextField
        label="Precondition"
        value={form.preCondition}
        onChange={handleChange("preCondition")}
        fullWidth
        multiline
      />
      <TextField
        label="Data Test"
        value={form.dataTest}
        onChange={handleChange("dataTest")}
        fullWidth
        multiline
      />
      <TextField
        label="Steps"
        value={form.steps}
        onChange={handleChange("steps")}
        fullWidth
        multiline
      />
      <TextField
        label="Expected Result"
        value={form.expectedResult}
        onChange={handleChange("expectedResult")}
        fullWidth
        multiline
      />

      {/* <FormControlLabel
        control={<Switch checked={form.status ?? false} onChange={handleToggle} />}
        label={form.status ? "Passed" : "Failed"}
      /> */}

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}
