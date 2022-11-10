import Input from '@components/shared/input';
import { signUpSchema } from '@utils/schemas';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { SignUpInput } from '@api/types';
import Button from '@components/shared/button';

interface Props {
  onSignUp: (values: SignUpInput, accountType: 'real') => void;
  createDemoUser: () => void;
}

const SignUpForm = ({ onSignUp, createDemoUser }: Props) => {
  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={signUpSchema}
      onSubmit={(e) => onSignUp(e, 'real')}
    >
      {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
        <Form className="flex flex-col gap-4 w-[25vw] text-main">
          <div className="">
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
          <div className="">
            <Input
              id="email"
              type="email"
              name="Email"
              placeholder="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errMsg={errors.email}
              touched={touched.email}
            ></Input>
          </div>
          <div className="">
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
          <div className="">
            <Input
              id="confirmPassword"
              type="password"
              name="Confirm Password"
              placeholder="confirm password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              errMsg={errors.confirmPassword}
              touched={touched.confirmPassword}
            ></Input>
          </div>
          <div>
            <Button
              classes="h-8 w-full"
              text={'Create account'}
              disabled={isSubmitting}
              type="submit"
              isPrimary
            ></Button>
          </div>
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <p className="mt-4 text-sm text-gray-400 sm:mt-0">
              Already have an account?
              <Link to="/login" className="underline ml-1 dark:text-white text-gray-400">
                Log in
              </Link>
              .
            </p>
          </div>
          <div className="flex justify-center">
            <button type="button" onClick={createDemoUser} className="text-center text-sm underline">
              Demo Account
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
