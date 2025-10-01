import React from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
type TaskStatus = "done" | "pending" | "try-again";
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  actionLabel: string;
  onAction: () => void;
}
const tasks: Task[] = [
  {
    id: "email",
    title: "Confirm email",
    description: "Your email has been confirmed.",
    status: "done",
    actionLabel: "Done",
    onAction: () => {},
  },
  {
    id: "paypal",
    title: "Set up PayPal payments",
    description:
      "We use PayPal to send you secure payments for completed tests. If you select “Connect PayPal account”, you’ll be taken to the PayPal website. Your banking details are not shared with UserTesting.",
    status: "pending",
    actionLabel: "Connect PayPal account",
    onAction: () => alert("Connect PayPal clicked"),
  },
  {
    id: "profile",
    title: "Your profile",
    description:
      "Update or provide a few more details at any time to make it easier for us to match you with tests.",
    status: "done",
    actionLabel: "Update profile",
    onAction: () => alert("Update profile clicked"),
  },
  {
    id: "practice",
    title: "Take a practice test",
    description:
      "Sorry, your test didn’t pass our review, but you can try again!",
    status: "try-again",
    actionLabel: "Take practice test",
    onAction: () => alert("Take practice test clicked"),
  },
];
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  if (status === "done") {
    return (
      <span className="flex items-center text-green-600 text-sm font-medium">
        {" "}
        <CheckCircle className="w-4 h-4 mr-1" /> Done{" "}
      </span>
    );
  }
  if (status === "try-again") {
    return (
      <span className="flex items-center text-yellow-600 text-sm font-medium">
        {" "}
        <AlertTriangle className="w-4 h-4 mr-1" /> Try again{" "}
      </span>
    );
  }
  return null;
};
export default function Checklist() {
  const completed = tasks.filter((t) => t.status === "done").length;
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {" "}
      <h1 className="text-2xl font-bold">
        Finish setting up your account
      </h1>{" "}
      <p className="">
        {" "}
        Complete all the tasks to start taking tests.{" "}
      </p>{" "}
      <p className="font-medium">
        {" "}
        {completed}/{tasks.length} tasks completed{" "}
      </p>{" "}
      {tasks.map((task) => (
        <div key={task.id} className="border rounded-lg p-4 shadow-sm ">
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {" "}
              {task.title} <StatusBadge status={task.status} />{" "}
            </h2>{" "}
          </div>{" "}
          <p className="text-gray-600 mt-1">{task.description}</p>{" "}
          {task.status !== "done" && (
            <button
              onClick={task.onAction}
              className="mt-3 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              {" "}
              {task.actionLabel}{" "}
            </button>
          )}{" "}
        </div>
      ))}{" "}
    </div>
  );
}
