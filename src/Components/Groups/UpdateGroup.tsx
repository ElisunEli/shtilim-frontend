

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import GroupService from '../../Services/GroupService';
import Group from '../../Models/IGroupModel';
import useTitle from '../../hooks/useTitle';

const defaultTheme = createTheme();

const UpdateGroup = () => {
  const { id } = useParams();
  const [group, setGroup] = useState<Group>({
    _id: '',
    name: '',
    teacher: '',
  });
  
  useTitle("כיתות");


  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<Group>();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        if (id) {
          const fetchedGroup = await GroupService.getGroup(id);
          setGroup(fetchedGroup);
          setValue('name', fetchedGroup.name);
          setValue('teacher', fetchedGroup.teacher);
        }
      } catch (error) {
        console.log(error);
        alert('Failed to fetch the group!');
      }
    };

    fetchGroup();
  }, []);

  const handleFormSubmit = async (data: Group) => {
    try {
      const updatedGroup = {
        _id: group._id,
        name: data.name,
        teacher: data.teacher,
      };

      await GroupService.updateGroup(group._id, updatedGroup);
      alert('You have successfully updated the group!');
      navigate('/groups');
    } catch (error) {
      if ((error as any).response) {
        console.log('Error response:', (error as any).response.data);
        console.log('Error status code:', (error as any).response.status);
      } else {
        console.log('Error:', (error as any).message);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/groups');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: green[500] }}>
            <EditIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            עדכון כיתה
          </Typography>
          {group && (
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="שם כיתה"
                defaultValue={group.name}
                autoFocus
                {...register('name')}
              />
              <TextField
                margin="normal"
                fullWidth
                id="teacher"
                label="מורה / גננת"
                defaultValue={group.teacher}
                {...register('teacher')}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                עדכון
              </Button>
              <Button fullWidth variant="contained" onClick={handleGoBack}>
                ביטול
              </Button>
            </form>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UpdateGroup;

