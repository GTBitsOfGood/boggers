import React, { ChangeEvent, useState, useEffect} from 'react';
import {TextField, Button} from "@material-ui/core";
import Stack from '@mui/material/Stack';

interface Props {
    name: string
}
export const MemberProfile = ({name}: Props) => {
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [preference, setPreference] = useState("")
    const [role, setRole] = useState("")
    const [project, setProject] = useState("")
    const [status, setStatus] = useState("")

    return (
        <div
          style={{
            marginLeft: "20%",
          }}
        >
        <Stack spacing = {0}>
            <h2>Member Name: {name}</h2>
            <Stack spacing = {0}> 
                <h3>Email ~ {email}</h3>
                <TextField
                    value={email}
                    label="Email"
                    onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing = {0}> 
                <h3>Phone Number ~ {number}</h3>
                <TextField
                    value={number}
                    label="Phone Number"
                    onChange={(e) => {
                    setNumber(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing = {0}> 
                <h3>Role ~ {role} </h3>
                <TextField
                    value={role}
                    label="Role"
                    onChange={(e) => {
                    setRole(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing = {0}> 
                <h3>Preference ~ {preference}</h3>
                <TextField
                    value={preference}
                    label="Preference"
                    onChange={(e) => {
                    setPreference(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing = {0}> 
                <h3>Project ~ {project}</h3>
                <TextField
                    value={project}
                    label="Project"
                    onChange={(e) => {
                    setProject(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing = {0}> 
                <h3>Status ~ {status}</h3>
                <TextField
                    value={status}
                    label="Status"
                    onChange={(e) => {
                    setStatus(e.target.value);
                    }}
                />
            </Stack>

        <Button style={{maxWidth: '100px'}} variant="contained" component = "label" color="primary" >Update</Button>

        </Stack>
          
        </div>
      );
}