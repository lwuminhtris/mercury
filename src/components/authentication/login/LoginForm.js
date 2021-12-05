import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// redux
import { useDispatch } from 'react-redux';
import ALogin from '../../../actions/loginAction';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  // const testSelectorUsername = useSelector((state) => state.login.username));
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
    password: Yup.string().required('Mật khẩu không được bỏ trống')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      const { username } = values;
      const { password } = values;
      axios
        .post('http://127.0.0.1:5000/account/login', {
          username,
          password
        })
        .then((res) => {
          if (res.data.status === 'OK') {
            dispatch(ALogin(values.username, res.data.page_names, res.data.page_ids));
            navigate('/dashboard', { replace: true });
          } else {
            window.alert('Sai tên đăng nhập hoặc mật khẩu');
          }
        });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="username"
              label="Tên đăng nhập"
              {...getFieldProps('username')}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
              // onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Mật khẩu"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Ghi nhớ đăng nhập"
            />

            <Link component={RouterLink} variant="subtitle2" to="#">
              Quên mật khẩu?
            </Link>
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Đăng nhập
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}
