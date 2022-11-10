import Input from '@components/shared/input';
import { loginSchema } from '@utils/schemas';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { LoginInput } from '@api/types';
import Button from '@components/shared/button';

interface Props {
  onLogin: (values: LoginInput) => void;
  createDemoUser: () => void;
}

const LoginForm = ({ onLogin, createDemoUser }: Props) => {
  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={loginSchema} onSubmit={(e) => onLogin(e)}>
      {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
        <Form className="flex flex-col gap-6 w-[25vw] text-main">
          <div>
            <Input
              id="username"
              type="text"
              name="Username"
              placeholder="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              errMsg={errors.username}
              touched={touched.username}
            ></Input>
          </div>
          <div>
            <Input
              id="password"
              type="password"
              name="Password"
              placeholder="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              errMsg={errors.password}
              touched={touched.password}
            ></Input>
          </div>
          <div>
            <Button classes="h-8 w-full" text={'Login'} disabled={isSubmitting} type="submit" isPrimary></Button>
          </div>
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <p className="mt-4 text-sm text-gray-400 sm:mt-0">
              Not registered?
              <Link to="/signup" className="dark:text-white text-gray-400 underline ml-1">
                Create Account
              </Link>
            </p>
          </div>
          <div className="flex justify-center">
            <button type="button" onClick={createDemoUser} className=" text-center text-sm underline">
              Demo Account
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
