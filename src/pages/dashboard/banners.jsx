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
import { ProductQuery, useAddBanner, useDeleteBanner, useUpdateBanner } from 'entities/product';
import { height, width } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import ButtonGroup from '@mui/material/ButtonGroup';

import { Autocomplete, TextField } from '@mui/material';

export default function DashboardBanners() {
  const { data: bannerList, refetch: bannerRefresh } = useQuery(ProductQuery.getBannerList());
  const useAddBannerMutation = useAddBanner();
  const useDeleteBannerMutation = useDeleteBanner();
  const useUpdateBannerMutation = useUpdateBanner();
  const options = ['blue', 'light'];

  const [isOpen, setIsOpen] = useState(null);
  const [value, setValue] = useState(10);
  const [category, setCategory] = useState([]);
  const [setFile, setSetFile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setIsOpen('banner');
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

    useAddBannerMutation.mutate(formData, {
      onSuccess: (data) => {
        bannerRefresh();
        setIsOpen(null);
        setSetFile(null);
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

    useUpdateBannerMutation.mutate(formData, {
      onSuccess: (data) => {
        bannerRefresh();
        setIsOpen(null);
        setSetFile(null);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const handleDelete = async () => {
    if (!selected) return;

    useDeleteBannerMutation.mutate(selected, {
      onSuccess: (data) => {
        bannerRefresh();
        setIsOpen(null);
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
                Add Banner
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <List component="nav">
              {bannerList &&
                bannerList.data &&
                bannerList.data.map((item) => (
                  <ListItem
                    key={item.seq}
                    component={ListItemButton}
                    divider
                    secondaryAction={
                      <Stack sx={{ alignItems: 'flex-end' }}>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                          <Button
                            color="warning"
                            onClick={() => {
                              setCurrentItem(item);
                              setIsOpen('updateBanner');
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
                      </Stack>
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
                    <ListItemText primary={<Typography variant="subtitle1">{item.title}</Typography>} secondary={item.description} />
                  </ListItem>
                ))}
            </List>
          </Box>
        </MainCard>
      </Grid>

      <Dialog
        open={isOpen === 'banner'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Banner'}</DialogTitle>

        <Formik
          initialValues={{
            title: '',
            description: '',
            theme: 'blue'
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(250).required('Title is required'),
            description: Yup.string().max(250).required('Description is required'),
            theme: Yup.string().required('Theme is required')
          })}
          onSubmit={submit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <OutlinedInput
                    id="title"
                    type="text"
                    value={values.title}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter title"
                    fullWidth
                    error={Boolean(touched.title && errors.title)}
                  />

                  <InputLabel htmlFor="description">Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter description"
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />

                  <InputLabel htmlFor="theme">Select Theme</InputLabel>
                  <Select
                    id="theme"
                    name="theme"
                    value={values.theme}
                    label="Select Theme"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.theme && errors.theme)}
                  >
                    {options.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

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
        open={isOpen === 'updateBanner'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Banner'}</DialogTitle>

        <Formik
          initialValues={{
            seq: currentItem?.seq ?? '',
            title: currentItem?.title ?? '',
            description: currentItem?.description ?? '',
            theme: currentItem?.theme ?? 'blue'
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(250).required('Title is required'),
            description: Yup.string().max(250).required('Description is required'),
            theme: Yup.string().required('Theme is required')
          })}
          onSubmit={update}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <OutlinedInput
                    id="title"
                    type="text"
                    value={values.title}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter title"
                    fullWidth
                    error={Boolean(touched.title && errors.title)}
                  />

                  <InputLabel htmlFor="description">Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter description"
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />

                  <InputLabel htmlFor="theme">Select Theme</InputLabel>
                  <Select
                    id="theme"
                    name="theme"
                    value={values.theme}
                    label="Select Theme"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.theme && errors.theme)}
                  >
                    {options.map((item) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ))}
                  </Select>

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
    </Grid>
  );
}
