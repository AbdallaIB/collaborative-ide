import { ProjectJoinInput } from '@api/types';
import Button from '@components/shared/button';
import Input from '@components/shared/input';
import { useLocalStorage } from '@lib/hooks/useLocalStorage';
import useAuthStore from '@lib/stores/auth';
import { Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { joinProjectSchema } from '@utils/schemas';

interface Props {
  onJoinProject: (values: ProjectJoinInput) => void;
}

const JoinProject = ({ onJoinProject }: Props) => {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const [username, setUsername] = useLocalStorage('username', authUser?.username || '');

  const initialValues = {
    sessionId: id || '',
    username: username || '',
  };

  return (
    <Formik initialValues={initialValues} validationSchema={joinProjectSchema} onSubmit={(e) => onJoinProject(e)}>
      {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
        <Form className="flex flex-col items-center justify-center w-full gap-6">
          <div className="w-full">
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
              style={{ width: '30vw' }}
            ></Input>
          </div>
          <div className="w-full">
            <Input
              id="sessionId"
              type="text"
              name="Session Id"
              placeholder="session id"
              value={values.sessionId}
              onChange={handleChange}
              onBlur={handleBlur}
              errMsg={errors.sessionId}
              touched={touched.sessionId}
              style={{ width: '30vw' }}
            ></Input>
          </div>
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <Button classes="h-8" text={'Join Project'} disabled={isSubmitting} type="submit" isPrimary></Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default JoinProject;
