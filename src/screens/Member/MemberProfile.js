import React, {useState} from "react";

export const MemberProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [preference, setPreference] = useState("");
  const [role, setRole] = useState("");
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");

  //adding value to pass linst check so I can commit and push
  return (
    <div>
      <form>
        <label>
          <h1>MemberName: </h1>
          <input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
        <label>
          <text>Email: </text>
          <input
            label="Email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>

        <label>
          <text>Number: </text>
          <input
            label="Phone Number"
            type="text"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
        </label>

        <label>
          <text>Preference: </text>
          <input
            label="Preference"
            type="text"
            value={preference}
            onChange={(e) => {
              setPreference(e.target.value);
            }}
          />
        </label>

        <label>
          <text>Role: </text>
          <input
            label="Role"
            type="text"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          />
        </label>

        <label>
          <text>Project: </text>
          <input
            label="Project"
            type="text"
            value={project}
            onChange={(e) => {
              setProject(e.target.value);
            }}
          />
        </label>

        <label>
          <text>Status: </text>
          <input
            label="Status"
            type="text"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          />
        </label>

        <button> Update </button>
      </form>
    </div>
  );
};
