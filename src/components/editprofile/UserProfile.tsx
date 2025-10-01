import React from "react";
interface ProfileItem {
  label: string;
  value: string;
}
interface UserProfileProps {
  profile: ProfileItem[];
  onEdit: () => void;
}
export default function UserProfile({ profile, onEdit }: UserProfileProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {" "}
      {/* Header */}{" "}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {" "}
          Edit profile{" "}
        </button>{" "}
      </div>{" "}
      {/* Table card */}{" "}
      <div className="shadow-lg rounded-lg overflow-hidden">
        {" "}
        <table className="w-full border-collapse">
          {" "}
          <thead>
            {" "}
            <tr>
              {" "}
              <th className="border border-gray-300 dark:border-gray-500 px-6 py-3 font-semibold w-1/3">
                {" "}
                Demographic{" "}
              </th>{" "}
              <th className="border border-gray-300 dark:border-gray-500 px-6 py-3 font-semibold">
                {" "}
                Description{" "}
              </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {profile.map((item, idx) => (
              <tr key={idx}>
                {" "}
                <td className="border border-gray-300 dark:border-gray-500 px-6 py-3 font-medium">
                  {" "}
                  {item.label}{" "}
                </td>{" "}
                <td className="border border-gray-300 dark:border-gray-500 px-6 py-3">
                  {" "}
                  {item.value}{" "}
                </td>{" "}
              </tr>
            ))}{" "}
          </tbody>{" "}
        </table>{" "}
      </div>{" "}
    </div>
  );
}
