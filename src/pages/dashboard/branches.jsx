import { useEffect, useState } from 'react';
// material-ui
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import * as Yup from 'yup';
import { Formik } from 'formik';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import MainCard from 'components/MainCard';
import config from 'config';

import { useQuery } from '@tanstack/react-query';
import { ProductQuery, useAddBranch, useDeleteBranch, useUpdateBranch } from 'entities/product';
import { height, width } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function DashboardBranches() {
  const { data: branchList, refetch: branchRefresh } = useQuery(ProductQuery.getBranchList());
  const useAddBranchMutation = useAddBranch();
  const useDeleteBranchMutation = useDeleteBranch();
  const useUpdateBranchMutation = useUpdateBranch();

  const [selected, setSelected] = useState(null);
  const options = ['blue', 'light'];
  const days = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'];
  const [isOpen, setIsOpen] = useState(null);
  const [value, setValue] = useState(10);
  const [category, setCategory] = useState([]);
  const [setFile, setSetFile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const times = [];

    for (let i = 0; i <= 23; i++) {
      const hour = i.toString().padStart(2, '0');
      times.push(`${hour}:00`);
    }

    setSchedule(times);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDelete = async () => {
    if (!selected) return;

    useDeleteBranchMutation.mutate(selected, {
      onSuccess: (data) => {
        branchRefresh();
        setIsOpen(null);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const handleClick = () => {
    setIsOpen('branch');
  };

  const submit = (values) => {
    if (!setFile) {
      alert('You need to add image.');
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', setFile);

    useAddBranchMutation.mutate(formData, {
      onSuccess: (data) => {
        branchRefresh();
        setIsOpen(null);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const update = (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (setFile) {
      formData.append('file', setFile);
    }

    useUpdateBranchMutation.mutate(formData, {
      onSuccess: (data) => {
        branchRefresh();
        setIsOpen(null);
        setSetFile(null);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSetFile(file);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Banners</Typography>
          </Grid>
          <Grid>
            <AnimateButton>
              <Button type="submit" fullWidth size="small" variant="contained" color="warning" onClick={handleClick}>
                Add Branch
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <List component="nav">
              {branchList &&
                branchList.data &&
                branchList.data.map((item) => (
                  <ListItem
                    key={item.seq}
                    component={ListItemButton}
                    divider
                    secondaryAction={
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <Stack sx={{ alignItems: 'flex-end' }}>
                          <Typography variant="subtitle1" noWrap>
                            {`${item.first_day_of_work} - ${item.last_day_of_work}`}
                          </Typography>
                          <Typography variant="h6" color="secondary" noWrap>
                            {`${item.start_work_time} - ${item.end_work_time}`}
                          </Typography>
                        </Stack>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                          <Button
                            color="warning"
                            onClick={() => {
                              setCurrentItem(item);
                              setIsOpen('updateBranch');
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            onClick={() => {
                              setSelected(item.seq);
                              setIsOpen('delete');
                            }}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{ color: 'success.main', bgcolor: 'success.lighter', width: 100, height: 60, borderRadius: 0, marginRight: 5 }}
                      >
                        <img
                          src={config.appUrl + '/common/download/' + item.file}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">{item.name}</Typography>} secondary={item.address} />
                  </ListItem>
                ))}
            </List>
          </Box>
        </MainCard>
      </Grid>

      <Dialog open={isOpen == 'delete'} keepMounted onClose={() => setIsOpen(null)} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{'Confirm the action'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Do you really want to delete this banner?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(null)}>CANCEL</Button>
          <Button onClick={handleDelete} color="error">
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isOpen === 'branch'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Branch'}</DialogTitle>

        <Formik
          initialValues={{
            name: '',
            address: '',
            first_day_of_work: 'Даваа',
            last_day_of_work: 'Баасан',
            start_work_time: '08:00',
            end_work_time: '20:00',
            phone: '',
            link: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(100).required('Name is required'),
            address: Yup.string().max(250).required('Address is required'),
            first_day_of_work: Yup.string().max(10).required('First Day of Work is required'),
            last_day_of_work: Yup.string().max(10).required('Last Day of Work is required'),
            start_work_time: Yup.string().max(10).required('Start work time is required'),
            end_work_time: Yup.string().max(10).required('End work time is required'),
            phone: Yup.string()
              .max(20)
              .matches(/^[0-9+\-\s]+$/, 'Invalid phone number')
              .required('Phone is required'),
            link: Yup.string().max(500).required('Link is required')
          })}
          onSubmit={submit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />

                  <InputLabel htmlFor="description">Address</InputLabel>
                  <OutlinedInput
                    id="address"
                    type="text"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter address"
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />

                  <InputLabel htmlFor="first_day_of_work">Select first day at work</InputLabel>
                  <Select
                    id="first_day_of_work"
                    name="first_day_of_work"
                    value={values.first_day_of_work}
                    label="Select first day at work"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.first_day_of_work && errors.first_day_of_work)}
                  >
                    {days.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                  <InputLabel htmlFor="last_day_of_work">Select Last day at work</InputLabel>
                  <Select
                    id="last_day_of_work"
                    name="last_day_of_work"
                    value={values.last_day_of_work}
                    label="Select Last day at work"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.last_day_of_work && errors.last_day_of_work)}
                  >
                    {days.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

                  <InputLabel htmlFor="start_work_time">Select start work time</InputLabel>
                  <Select
                    id="start_work_time"
                    name="start_work_time"
                    value={values.start_work_time}
                    label="Select start work time"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.start_work_time && errors.start_work_time)}
                  >
                    {schedule.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

                  <InputLabel htmlFor="end_work_time">Select end work time</InputLabel>
                  <Select
                    id="end_work_time"
                    name="end_work_time"
                    value={values.end_work_time}
                    label="Select end work time"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.end_work_time && errors.end_work_time)}
                  >
                    {schedule.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <OutlinedInput
                    id="phone"
                    type="text"
                    value={values.phone}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    fullWidth
                    error={Boolean(touched.phone && errors.phone)}
                  />

                  <InputLabel htmlFor="link">Link</InputLabel>
                  <OutlinedInput
                    id="link"
                    type="text"
                    value={values.link}
                    name="link"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter map link"
                    fullWidth
                    error={Boolean(touched.link && errors.link)}
                  />

                  <Button variant="contained" component="label" color="info" fullWidth>
                    {setFile ? setFile.name : 'Upload File'}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsOpen(null)}>Cancel</Button>
                <Button type="submit" autoFocus>
                  SAVE
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      <Dialog
        open={isOpen === 'updateBranch'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Branch'}</DialogTitle>

        <Formik
          initialValues={{
            seq: currentItem?.seq ?? '',
            name: currentItem?.name ?? '',
            address: currentItem?.address ?? '',
            first_day_of_work: currentItem?.first_day_of_work ?? 'Даваа',
            last_day_of_work: currentItem?.last_day_of_work ?? 'Баасан',
            start_work_time: currentItem?.start_work_timeame ?? '08:00',
            end_work_time: currentItem?.end_work_time ?? '20:00',
            phone: currentItem?.phone ?? '',
            link: currentItem?.link ?? ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(100).required('Name is required'),
            address: Yup.string().max(250).required('Address is required'),
            first_day_of_work: Yup.string().max(10).required('First Day of Work is required'),
            last_day_of_work: Yup.string().max(10).required('Last Day of Work is required'),
            start_work_time: Yup.string().max(10).required('Start work time is required'),
            end_work_time: Yup.string().max(10).required('End work time is required'),
            phone: Yup.string()
              .max(20)
              .matches(/^[0-9+\-\s]+$/, 'Invalid phone number')
              .required('Phone is required'),
            link: Yup.string().max(500).required('Link is required')
          })}
          onSubmit={update}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />

                  <InputLabel htmlFor="description">Address</InputLabel>
                  <OutlinedInput
                    id="address"
                    type="text"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter address"
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />

                  <InputLabel htmlFor="first_day_of_work">Select first day at work</InputLabel>
                  <Select
                    id="first_day_of_work"
                    name="first_day_of_work"
                    value={values.first_day_of_work}
                    label="Select first day at work"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.first_day_of_work && errors.first_day_of_work)}
                  >
                    {days.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                  <InputLabel htmlFor="last_day_of_work">Select Last day at work</InputLabel>
                  <Select
                    id="last_day_of_work"
                    name="last_day_of_work"
                    value={values.last_day_of_work}
                    label="Select Last day at work"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.last_day_of_work && errors.last_day_of_work)}
                  >
                    {days.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

                  <InputLabel htmlFor="start_work_time">Select start work time</InputLabel>
                  <Select
                    id="start_work_time"
                    name="start_work_time"
                    value={values.start_work_time}
                    label="Select start work time"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.start_work_time && errors.start_work_time)}
                  >
                    {schedule.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

                  <InputLabel htmlFor="end_work_time">Select end work time</InputLabel>
                  <Select
                    id="end_work_time"
                    name="end_work_time"
                    value={values.end_work_time}
                    label="Select end work time"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.end_work_time && errors.end_work_time)}
                  >
                    {schedule.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <OutlinedInput
                    id="phone"
                    type="text"
                    value={values.phone}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    fullWidth
                    error={Boolean(touched.phone && errors.phone)}
                  />

                  <InputLabel htmlFor="link">Link</InputLabel>
                  <OutlinedInput
                    id="link"
                    type="text"
                    value={values.link}
                    name="link"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter map link"
                    fullWidth
                    error={Boolean(touched.link && errors.link)}
                  />

                  <Button variant="contained" component="label" color="info" fullWidth>
                    {setFile ? setFile.name : 'Upload File'}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsOpen(null)}>Cancel</Button>
                <Button type="submit" autoFocus>
                  SAVE
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Grid>
  );
}
