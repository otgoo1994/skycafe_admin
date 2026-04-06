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
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import MainCard from 'components/MainCard';
import config from 'config';

import { useQuery } from '@tanstack/react-query';
import {
  ProductQuery,
  useAddSet,
  useAddProduct,
  useAddCategory,
  useDeleteCategory,
  useDeleteProduct,
  useDeleteSetProduct,
  useUpdateProduct,
  useUpdateSetProduct,
  useUpdateCategory
} from 'entities/product';
import { height, width } from '@mui/system';
import AnimateButton from 'components/@extended/AnimateButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Autocomplete, TextField } from '@mui/material';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardDefault() {
  const { data: producSettList, refetch: setRefetch } = useQuery(ProductQuery.getSetProductList());
  const { data: productList, refetch: productRefetch } = useQuery(ProductQuery.getProductList());
  const { data: categoryList, refetch: categoryRefetch } = useQuery(ProductQuery.getCategoryList());

  const useAddSetMutation = useAddSet();
  const useAddProductMutation = useAddProduct();
  const useAddCategoryMutation = useAddCategory();
  const useDeleteCategoryMutation = useDeleteCategory();
  const useDeleteProductMutation = useDeleteProduct();
  const useDeleteSetProductMutation = useDeleteSetProduct();
  const useUpdateProductMutation = useUpdateProduct();
  const useUpdateSetProductMutation = useUpdateSetProduct();
  const useUpdateCategoryMutation = useUpdateCategory();

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isOpen, setIsOpen] = useState(null);
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState([]);
  const [setFile, setSetFile] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    if (value === 0) {
      setIsOpen('set');
    }

    if (value === 1) {
      setIsOpen('product');
    }

    if (value === 2) {
      setIsOpen('category');
    }
  };

  const handleDelete = async () => {
    if (!selected || !selectedType) return;

    if (selectedType === 'category') {
      useDeleteCategoryMutation.mutate(selected, {
        onSuccess: (data) => {
          categoryRefetch();
          setIsOpen(null);
        },
        onError: (error) => {
          console.log(error);
        }
      });

      return;
    }

    if (selectedType === 'product') {
      useDeleteProductMutation.mutate(selected, {
        onSuccess: (data) => {
          productRefetch();
          setIsOpen(null);
        },
        onError: (error) => {
          console.log(error);
        }
      });

      return;
    }

    if (selectedType === 'set') {
      useDeleteSetProductMutation.mutate(selected, {
        onSuccess: (data) => {
          setRefetch();
          setIsOpen(null);
        },
        onError: (error) => {
          console.log(error);
        }
      });

      return;
    }
  };

  const submit = (values) => {
    if (value === 2) {
      useAddCategoryMutation.mutate(values, {
        onSuccess: (data) => {
          categoryRefetch();
          setIsOpen(null);
        },
        onError: (error) => {
          console.log(error);
        }
      });
      return;
    }

    if (!setFile) {
      alert('You need to add image.');
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (value === 0) {
      formData.append('file', setFile);
      useAddSetMutation.mutate(formData, {
        onSuccess: (data) => {
          setRefetch();
          setIsOpen(null);
          setSetFile(null);
        },
        onError: (error) => {
          console.log(error);
        }
      });
    }

    if (value === 1) {
      formData.append('file', setFile);
      useAddProductMutation.mutate(formData, {
        onSuccess: (data) => {
          productRefetch();
          setIsOpen(null);
          setSetFile(null);
        },
        onError: (error) => {
          console.log(error);
        }
      });
    }
  };

  const updateProductSubmit = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (setFile) {
      formData.append('file', setFile);
    }

    useUpdateProductMutation.mutate(formData, {
      onSuccess: (data) => {
        productRefetch();
        setIsOpen(null);
        setSetFile(null);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const updateSetProductSubmit = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (setFile) {
      formData.append('file', setFile);
    }

    useUpdateSetProductMutation.mutate(formData, {
      onSuccess: (data) => {
        setRefetch();
        setIsOpen(null);
        setSetFile(null);
      },
      onError: (error) => {
        console.log(error);
      }
    });
  };

  const updateCategorySubmit = (values) => {
    useUpdateCategoryMutation.mutate(values, {
      onSuccess: (data) => {
        categoryRefetch();
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

  useEffect(() => {
    if (categoryList && categoryList.data) {
      setCategory(categoryList.data);
    }
  }, [categoryList]);

  useEffect(() => {
    if (productList && productList.data) {
      setOptions(productList.data);
    }
  }, [productList]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h5">Product List</Typography>
          </Grid>
          <Grid>
            <AnimateButton>
              <Button type="submit" fullWidth size="small" variant="contained" color="warning" onClick={handleClick}>
                {value === 0 ? 'Add Set' : value === 1 ? 'Add Single Product' : 'Add Category'}
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Set" {...a11yProps(0)} />
              <Tab label="Single" {...a11yProps(1)} />
              <Tab label="Category" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <List component="nav">
              {producSettList &&
                producSettList.data &&
                producSettList.data.map((item) => (
                  <ListItem
                    key={item.seq}
                    component={ListItemButton}
                    divider
                    secondaryAction={
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <Stack sx={{ alignItems: 'flex-end' }}>
                          <Typography variant="subtitle1" noWrap>
                            ${item.price.toLocaleString()}
                          </Typography>
                          <Typography variant="h6" color="secondary" noWrap>
                            -
                          </Typography>
                        </Stack>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                          <Button
                            color="warning"
                            onClick={() => {
                              console.log(item.items);

                              setCurrentItem(item);
                              setIsOpen('updateSet');
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            onClick={() => {
                              setSelected(item.seq);
                              setSelectedType('set');
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
                    <ListItemText primary={<Typography variant="subtitle1">{item.name}</Typography>} secondary={item.description} />
                  </ListItem>
                ))}
            </List>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <List component="nav">
              {productList &&
                productList.data &&
                productList.data.map((item) => (
                  <ListItem
                    key={item.seq}
                    component={ListItemButton}
                    divider
                    secondaryAction={
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <Stack sx={{ alignItems: 'flex-end' }}>
                          <Typography variant="subtitle1" noWrap>
                            ${item.price.toLocaleString()}
                          </Typography>
                          <Typography variant="h6" color="secondary" noWrap>
                            -
                          </Typography>
                        </Stack>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                          <Button
                            color="warning"
                            onClick={() => {
                              setCurrentItem(item);
                              setIsOpen('updateProduct');
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            onClick={() => {
                              setSelected(item.seq);
                              setSelectedType('product');
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
                    <ListItemText primary={<Typography variant="subtitle1">{item.name}</Typography>} secondary={item.description} />
                  </ListItem>
                ))}
            </List>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <List component="nav">
              {categoryList &&
                categoryList.data &&
                categoryList.data.map((item) => (
                  <ListItem
                    key={item.seq}
                    component={ListItemButton}
                    divider
                    secondaryAction={
                      <ButtonGroup variant="outlined" aria-label="Loading button group">
                        <Button
                          color="warning"
                          onClick={() => {
                            setCurrentItem(item);
                            setIsOpen('updateCategory');
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            setSelected(item.seq);
                            setSelectedType('category');
                            setIsOpen('delete');
                          }}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    }
                  >
                    <ListItemText primary={<Typography variant="subtitle1">{item.name}</Typography>} secondary={item.description} />
                  </ListItem>
                ))}
            </List>
          </CustomTabPanel>
        </MainCard>
      </Grid>

      <Dialog
        open={isOpen === 'set'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Set'}</DialogTitle>

        <Formik
          initialValues={{
            name: '',
            price: '',
            description: '',
            category_id: '',
            products: []
          }}
          validationSchema={Yup.object().shape({
            description: Yup.string().max(250).required('Description is required'),
            name: Yup.string().max(90).required('Name is required'),
            category_id: Yup.number().required('Category is required'),
            price: Yup.number().required('Price is required')
          })}
          onSubmit={submit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="email-login">Set Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter set name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />

                  <InputLabel htmlFor="set-price">Set Price</InputLabel>
                  <OutlinedInput
                    id="price"
                    type="text"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter set price"
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                  />

                  <InputLabel htmlFor="set-description">Set Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter set description"
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />

                  <InputLabel htmlFor="set-category-id">Select Category</InputLabel>
                  <Select
                    id="category_id"
                    name="category_id"
                    value={values.category_id}
                    label="Select Category"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.category_id && errors.category_id)}
                  >
                    {category.map((item) => (
                      <MenuItem value={item.seq}>{item.name}</MenuItem>
                    ))}
                  </Select>

                  <Button variant="contained" component="label" color="info" fullWidth>
                    {setFile ? setFile.name : 'Upload File'}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  <InputLabel htmlFor="set-category-id">Select Products</InputLabel>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={options}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.seq === value.seq}
                    value={options.filter((option) => values.products.includes(option.seq))}
                    onChange={(e, newValue) => {
                      setFieldValue(
                        'products',
                        newValue.map((v) => v.seq)
                      );
                    }}
                    renderInput={(params) => <TextField {...params} label="Select product" />}
                  />
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
        open={isOpen === 'product'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Product'}</DialogTitle>

        <Formik
          initialValues={{
            name: '',
            price: '',
            description: '',
            category_id: '',
            ingredients: ''
          }}
          validationSchema={Yup.object().shape({
            description: Yup.string().max(250).required('Description is required'),
            name: Yup.string().max(90).required('Name is required'),
            ingredients: Yup.string().max(255).required('Ingredients is required'),
            category_id: Yup.number().required('Category is required'),
            price: Yup.number().required('Price is required')
          })}
          onSubmit={submit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="email-login">Product Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />

                  <InputLabel htmlFor="set-price">Product Price</InputLabel>
                  <OutlinedInput
                    id="price"
                    type="text"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product price"
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                  />

                  <InputLabel htmlFor="set-description">Product Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />

                  <InputLabel htmlFor="set-description">Product Ingredients</InputLabel>
                  <OutlinedInput
                    id="ingredients"
                    type="text"
                    value={values.ingredients}
                    name="ingredients"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product ingredients"
                    fullWidth
                    error={Boolean(touched.ingredients && errors.ingredients)}
                  />

                  <InputLabel htmlFor="set-category-id">Select Category</InputLabel>
                  <Select
                    id="category_id"
                    name="category_id"
                    value={values.category_id}
                    label="Select Category"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.category_id && errors.category_id)}
                  >
                    {category.map((item) => (
                      <MenuItem value={item.seq}>{item.name}</MenuItem>
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
        open={isOpen === 'category'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Add Category'}</DialogTitle>

        <Formik
          initialValues={{
            name: ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(90).required('Name is required')
          })}
          onSubmit={submit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="email-login">Category Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
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

      <Dialog
        open={isOpen === 'updateProduct'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Product'}</DialogTitle>

        <Formik
          initialValues={{
            seq: currentItem?.seq ?? '',
            name: currentItem?.name ?? '',
            price: currentItem?.price ?? '',
            description: currentItem?.description ?? '',
            category_id: currentItem?.category_id ?? '',
            ingredients: currentItem?.ingredients ?? ''
          }}
          validationSchema={Yup.object().shape({
            description: Yup.string().max(250).required('Description is required'),
            name: Yup.string().max(90).required('Name is required'),
            ingredients: Yup.string().max(255).required('Ingredients is required'),
            category_id: Yup.number().required('Category is required'),
            price: Yup.number().required('Price is required')
          })}
          onSubmit={updateProductSubmit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="email-login">Product Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />

                  <InputLabel htmlFor="set-price">Product Price</InputLabel>
                  <OutlinedInput
                    id="price"
                    type="text"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product price"
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                  />

                  <InputLabel htmlFor="set-description">Product Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />

                  <InputLabel htmlFor="set-description">Product Ingredients</InputLabel>
                  <OutlinedInput
                    id="ingredients"
                    type="text"
                    value={values.ingredients}
                    name="ingredients"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter product ingredients"
                    fullWidth
                    error={Boolean(touched.ingredients && errors.ingredients)}
                  />

                  <InputLabel htmlFor="set-category-id">Select Category</InputLabel>
                  <Select
                    id="category_id"
                    name="category_id"
                    value={values.category_id}
                    label="Select Category"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.category_id && errors.category_id)}
                  >
                    {category.map((item) => (
                      <MenuItem value={item.seq}>{item.name}</MenuItem>
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
        open={isOpen === 'updateSet'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Set'}</DialogTitle>

        <Formik
          initialValues={{
            seq: currentItem?.seq ?? '',
            name: currentItem?.name ?? '',
            price: currentItem?.price ?? '',
            description: currentItem?.description ?? '',
            category_id: currentItem?.category_id ?? '',
            products: currentItem?.items ? currentItem?.items.map((item) => item.seq) : []
          }}
          validationSchema={Yup.object().shape({
            description: Yup.string().max(250).required('Description is required'),
            name: Yup.string().max(90).required('Name is required'),
            category_id: Yup.number().required('Category is required'),
            price: Yup.number().required('Price is required')
          })}
          onSubmit={updateSetProductSubmit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="email-login">Set Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter set name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />

                  <InputLabel htmlFor="set-price">Set Price</InputLabel>
                  <OutlinedInput
                    id="price"
                    type="text"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter set price"
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                  />

                  <InputLabel htmlFor="set-description">Set Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    type="text"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter set description"
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />

                  <InputLabel htmlFor="set-category-id">Select Category</InputLabel>
                  <Select
                    id="category_id"
                    name="category_id"
                    value={values.category_id}
                    label="Select Category"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.category_id && errors.category_id)}
                  >
                    {category.map((item) => (
                      <MenuItem value={item.seq}>{item.name}</MenuItem>
                    ))}
                  </Select>

                  <Button variant="contained" component="label" color="info" fullWidth>
                    {setFile ? setFile.name : 'Upload File'}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  <InputLabel htmlFor="set-category-id">Select Products</InputLabel>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={options}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.seq === value.seq}
                    value={options.filter((option) => values.products.includes(option.seq))}
                    onChange={(e, newValue) => {
                      setFieldValue(
                        'products',
                        newValue.map((v) => v.seq)
                      );
                    }}
                    renderInput={(params) => <TextField {...params} label="Select product" />}
                  />
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
        open={isOpen === 'updateCategory'}
        onClose={() => setIsOpen(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Update Category'}</DialogTitle>

        <Formik
          initialValues={{
            seq: currentItem?.seq ?? '',
            name: currentItem?.name ?? ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(90).required('Name is required')
          })}
          onSubmit={updateCategorySubmit}
        >
          {({ errors, handleBlur, handleChange, touched, values, handleSubmit, setFieldValue }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={1}>
                  <InputLabel htmlFor="email-login">Category Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
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
